#!/usr/bin/env python3
"""
Seed PostgreSQL Database from tempcsebase live_export.sql
Maps all 41 MySQL tables and relations into canonical PostgreSQL schema.
"""

import os
import re
import uuid
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXPORT_PATH = os.path.join(BASE_DIR, "../../tempcsebase/schema-design/live_export.sql")
if not os.path.exists(EXPORT_PATH):
    EXPORT_PATH = "/home/divyansh/Development/Projects/tempcsebase/schema-design/live_export.sql"
OUTPUT_SQL_PATH = os.path.join(BASE_DIR, "../migrations/seed_from_tempcse.sql")

INSTITUTION_ID = "11111111-1111-1111-1111-111111111111"
CSE_DEPT_ID = "22222222-2222-2222-2222-222222222222"
ADMIN_USER_ID = "33333333-3333-3333-3333-333333333333"

ROLE_ADMIN_ID = "00000000-0000-0000-0000-000000000001"
ROLE_DEPT_ADMIN_ID = "00000000-0000-0000-0000-000000000003"
ROLE_FACULTY_ID = "00000000-0000-0000-0000-000000000005"

METRIC_SCOPUS_ID = "44444444-4444-4444-4444-444444444441"
METRIC_SCHOLAR_ID = "44444444-4444-4444-4444-444444444442"
METRIC_ORCID_ID = "44444444-4444-4444-4444-444444444443"

PROGRAM_MAP = {
    1: "66666666-6666-6666-6666-666666666661", # B.Tech
    2: "66666666-6666-6666-6666-666666666662", # M.Tech
    3: "66666666-6666-6666-6666-666666666663", # Dual Degree
    4: "66666666-6666-6666-6666-666666666665", # Ph.D
}

RESEARCH_TYPE_MAP = {
    1: "JOURNAL",
    2: "CONFERENCE",
    3: "BOOK",
    4: "BOOK_CHAPTER",
}

SUPERVISION_TYPE_MAP = {
    1: "MTech",
    2: "PhD",
}


def parse_sql_values(values_str):
    """
    Parses SQL tuples from a VALUES string into a list of Python lists.
    Handles quotes, escaped characters, and NULLs properly.
    """
    rows = []
    i = 0
    n = len(values_str)
    
    while i < n:
        while i < n and values_str[i] != '(':
            i += 1
        if i >= n:
            break
        i += 1 # skip '('
        
        row = []
        current_token = []
        in_quotes = False
        escape = False
        
        while i < n:
            c = values_str[i]
            
            if escape:
                current_token.append(c)
                escape = False
                i += 1
                continue
                
            if c == '\\':
                escape = True
                i += 1
                continue
                
            if c == "'":
                if in_quotes:
                    # check for '' escape
                    if i + 1 < n and values_str[i + 1] == "'":
                        current_token.append("'")
                        i += 2
                        continue
                    else:
                        in_quotes = False
                        i += 1
                        continue
                else:
                    in_quotes = True
                    i += 1
                    continue
                    
            if in_quotes:
                current_token.append(c)
                i += 1
                continue
                
            if c == ',':
                token = ''.join(current_token).strip()
                if token == 'NULL':
                    row.append(None)
                else:
                    row.append(token)
                current_token = []
                i += 1
                continue
                
            if c == ')':
                token = ''.join(current_token).strip()
                if token == 'NULL':
                    row.append(None)
                elif token:
                    row.append(token)
                rows.append(row)
                i += 1
                break
                
            current_token.append(c)
            i += 1
            
    return rows


def escape_sql_string(val):
    if val is None:
        return "NULL"
    s = str(val).replace("'", "''")
    return f"'{s}'"

def escape_sql_num(val, default=0):
    if val is None or val == "":
        return str(default) if default is not None else "NULL"
    try:
        float(val)
        return str(val)
    except ValueError:
        return str(default) if default is not None else "NULL"

def escape_sql_date(val):
    if not val or val == "NULL" or val == "0000-00-00":
        return "NULL"
    val_str = str(val).strip()
    for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%d/%m/%Y", "%m/%d/%Y %H:%M:%S", "%Y"):
        try:
            d = datetime.strptime(val_str, fmt)
            return f"'{d.strftime('%Y-%m-%d')}'"
        except ValueError:
            pass
    return "NULL"

def escape_sql_year(val, default=2024):
    if not val or val == "NULL":
        return str(default)
    try:
        y = int(str(val)[:4])
        return str(y)
    except ValueError:
        return str(default)


def main():
    print(f"Reading live_export.sql from {EXPORT_PATH}...")
    table_data = {}
    with open(EXPORT_PATH, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if line.startswith("INSERT INTO"):
                m = re.match(r"INSERT INTO \`?([a-zA-Z0-9_]+)\`?\s+VALUES\s*", line)
                if m:
                    tname = m.group(1)
                    raw_vals = line[m.end():].strip()
                    if raw_vals.endswith(";"):
                        raw_vals = raw_vals[:-1]
                    rows = parse_sql_values(raw_vals)
                    table_data[tname] = rows
                    print(f"Loaded table: {tname:35} with {len(rows)} rows")

    out_lines = []
    out_lines.append("-- ============================================================================")
    out_lines.append("-- Automated Data Seeding from tempcsebase live_export.sql into PostgreSQL")
    out_lines.append("-- ============================================================================")
    out_lines.append("BEGIN;")
    out_lines.append("")

    # Map storage for legacy IDs to UUIDs
    legacy_faculty_map = {} # int -> UUID
    legacy_user_map = {}    # int -> UUID
    legacy_pub_map = {}     # int -> UUID
    legacy_proj_map = {}    # int -> UUID
    legacy_pat_map = {}     # int -> UUID
    legacy_cons_map = {}    # int -> UUID
    legacy_sup_map = {}     # int -> UUID
    legacy_event_map = {}   # int -> UUID
    legacy_lab_map = {}     # int -> UUID

    # 1. Metric Sources
    out_lines.append("-- 1. Metric Sources")
    out_lines.append(f"INSERT INTO metric_sources (id, code, name) VALUES ('{METRIC_SCOPUS_ID}', 'SCOPUS', 'Elsevier Scopus') ON CONFLICT (code) DO NOTHING;")
    out_lines.append(f"INSERT INTO metric_sources (id, code, name) VALUES ('{METRIC_SCHOLAR_ID}', 'GOOGLE_SCHOLAR', 'Google Scholar Citations') ON CONFLICT (code) DO NOTHING;")
    out_lines.append(f"INSERT INTO metric_sources (id, code, name) VALUES ('{METRIC_ORCID_ID}', 'ORCID', 'ORCID Open Researcher Contributor ID') ON CONFLICT (code) DO NOTHING;")
    out_lines.append("")

    # 2. Seed Faculty & Users
    out_lines.append("-- 2. Faculty & User Accounts")
    fac_rows = table_data.get("faculty", [])
    user_rows = table_data.get("user_accounts", [])

    users_by_faculty = {}
    for u in user_rows:
        f_id = int(u[1]) if u[1] is not None else None
        if f_id:
            users_by_faculty[f_id] = u

    seen_emails = set()
    for row in fac_rows:
        leg_id = int(row[0])
        fac_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.faculty.{leg_id}"))
        user_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.user.{leg_id}"))
        legacy_faculty_map[leg_id] = fac_uuid
        legacy_user_map[leg_id] = user_uuid

        emp_code = row[1] or f"FAC-{leg_id:03d}"
        name = row[2] or "Faculty Member"
        pos = row[3] or "Assistant Professor"
        is_perm = True if str(row[4]) in ("1", "true", "True") else False
        phone = row[5] or ""
        email = row[6] or f"faculty{leg_id}@nith.ac.in"
        email = email.replace("[at]", "@").replace("[dot]", ".").replace(" ", "").lower()
        if email in seen_emails:
            email = f"fac{leg_id}_{email}"
        seen_emails.add(email)

        portfolio_slug = row[7] or f"fac-{leg_id}"
        photo_url = row[8] or ""
        sort_order = int(row[9]) if row[9] is not None else 0
        research_interests = row[10] or ""

        user_acc = users_by_faculty.get(leg_id)
        pwd_hash = user_acc[5] if user_acc and user_acc[5] else "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYeq"
        first_login = True if user_acc and str(user_acc[6]) in ("1", "true") else False

        # Insert user
        out_lines.append(f"""INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('{user_uuid}', {escape_sql_string(email)}, {escape_sql_string(pwd_hash)}, {escape_sql_string(name)}, TRUE, {'TRUE' if first_login else 'FALSE'})
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;""")

        # Insert user_role
        out_lines.append(f"""INSERT INTO user_roles (user_id, role_id)
VALUES ('{user_uuid}', '{ROLE_FACULTY_ID}')
ON CONFLICT (user_id, role_id) DO NOTHING;""")

        # Insert faculty
        out_lines.append(f"""INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('{fac_uuid}', '{user_uuid}', {escape_sql_string(emp_code)}, {escape_sql_string(email)}, {escape_sql_string(name)}, {escape_sql_string(pos)}, {'TRUE' if is_perm else 'FALSE'}, {escape_sql_string(phone)}, {escape_sql_string(photo_url)}, {escape_sql_string(portfolio_slug)}, {sort_order}, {escape_sql_string(research_interests)})
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;""")

        # Insert primary appointment to CSE
        out_lines.append(f"""INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('{fac_uuid}', '{CSE_DEPT_ID}', {escape_sql_string(pos)}, TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;""")

        # Record legacy id map
        out_lines.append(f"INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', {leg_id}, 'faculty', '{fac_uuid}') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;")

    out_lines.append("")

    # 3. Faculty Profiles
    out_lines.append("-- 3. Faculty Profiles")
    prof_rows = table_data.get("faculty_profiles", [])
    for row in prof_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            dob = escape_sql_date(row[2])
            doj = escape_sql_date(row[3])
            scholar = escape_sql_string(row[4])
            scopus = escape_sql_string(row[5])
            publons = escape_sql_string(row[6])
            orcid = escape_sql_string(row[7])
            rg = escape_sql_string(row[8])
            vidwan = escape_sql_string(row[9])
            linkedin = escape_sql_string(row[10])

            out_lines.append(f"""INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('{fac_uuid}', {dob}, {doj}, {scholar}, {scopus}, {publons}, {orcid}, {rg}, {vidwan}, {linkedin})
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;""")

    out_lines.append("")

    # 4. Qualifications
    out_lines.append("-- 4. Faculty Qualifications")
    qual_rows = table_data.get("faculty_qualifications", [])
    for row in qual_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            degree = escape_sql_string(row[2] or "Degree")
            inst = escape_sql_string(row[3] or "University")
            year = escape_sql_year(row[4])
            out_lines.append(f"""INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('{fac_uuid}', {degree}, {inst}, {year});""")

    out_lines.append("")

    # 5. Teaching Experience
    out_lines.append("-- 5. Faculty Teaching Experiences")
    teach_rows = table_data.get("faculty_teaching_experiences", [])
    for row in teach_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            pos = escape_sql_string(row[2] or "Teaching Role")
            dept = escape_sql_string(row[3] or "Department")
            sdate = escape_sql_date(row[4])
            if sdate == "NULL":
                sdate = "'2015-01-01'"
            edate = escape_sql_date(row[5])
            out_lines.append(f"""INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('{fac_uuid}', {pos}, {dept}, {sdate}, {edate});""")

    out_lines.append("")

    # 6. Administrative Experience
    out_lines.append("-- 6. Faculty Administrative Experiences")
    admin_rows = table_data.get("faculty_administrative_experiences", [])
    for row in admin_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            pos = escape_sql_string(row[2] or "Administrative Role")
            org = escape_sql_string(row[3] or "NIT Hamirpur")
            sdate = escape_sql_date(row[4])
            if sdate == "NULL":
                sdate = "'2020-01-01'"
            edate = escape_sql_date(row[5])
            out_lines.append(f"""INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('{fac_uuid}', {pos}, {org}, {sdate}, {edate});""")

    out_lines.append("")

    # 7. Honors
    out_lines.append("-- 7. Faculty Honors")
    honors_rows = table_data.get("faculty_honors", [])
    for row in honors_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            title = escape_sql_string(row[2] or "Honor / Award")
            given = escape_sql_string(row[3] or "Awarding Body")
            year = escape_sql_year(row[4])
            out_lines.append(f"""INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('{fac_uuid}', {title}, {given}, {year});""")

    out_lines.append("")

    # 8. Exposures
    out_lines.append("-- 8. Faculty Exposures")
    expo_rows = table_data.get("faculty_exposures", [])
    for row in expo_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            title = escape_sql_string(row[2] or "Workshop / Exposure")
            desc = escape_sql_string(row[3] or "")
            out_lines.append(f"""INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('{fac_uuid}', {title}, {desc}, '2023-01-01');""")

    out_lines.append("")

    # 9. Expert Talks
    out_lines.append("-- 9. Expert Talks")
    talk_rows = table_data.get("expert_talks", [])
    for row in talk_rows:
        f_id = int(row[1])
        if f_id in legacy_faculty_map:
            fac_uuid = legacy_faculty_map[f_id]
            title = escape_sql_string(row[2] or "Invited Expert Talk")
            venue = escape_sql_string(row[3] or "NITH")
            tdate = escape_sql_date(row[4])
            if tdate == "NULL":
                tdate = "'2023-05-01'"
            desc = escape_sql_string(row[7] or "")
            out_lines.append(f"""INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('{fac_uuid}', {title}, {venue}, {venue}, {tdate}, {desc});""")

    out_lines.append("")

    # 10. Canonical Publications
    out_lines.append("-- 10. Publications")
    pub_rows = table_data.get("publications", [])
    seen_dois = set()

    for row in pub_rows:
        leg_id = int(row[0])
        pub_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.pub.{leg_id}"))
        legacy_pub_map[leg_id] = pub_uuid

        title = row[1] or "Research Paper"
        venue = row[2] or ""
        vol = (row[3] or "")[:50]
        issue = (row[4] or "")[:50]
        pages = (row[5] or "")[:50]
        year = escape_sql_year(row[6])
        doi = row[9]
        if doi:
            doi = doi.strip()[:255]
            if doi.lower().startswith("doi:"):
                doi = doi[4:].strip()
            if "doi.org/" in doi:
                doi = doi.split("doi.org/")[-1].strip()
            if doi.lower() in ("na", "n/a", "-", "--", "nil", "none", ""):
                doi = None
            elif doi.lower() in seen_dois:
                doi = None
            else:
                seen_dois.add(doi.lower())

        rtype_id = int(row[10]) if row[10] is not None else 1
        ptype = RESEARCH_TYPE_MAP.get(rtype_id, "JOURNAL")
        indexing = (row[11] or "Scopus")[:50]
        quartile = row[12][:20] if row[12] else None
        authors = row[13] or "Faculty Authors"
        isbn = row[14][:50] if row[14] else None

        out_lines.append(f"""INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('{pub_uuid}', {escape_sql_string(title)}, '{ptype}', {escape_sql_string(doi)}, {escape_sql_string(isbn)}, {escape_sql_string(venue)}, {escape_sql_string(vol)}, {escape_sql_string(issue)}, {escape_sql_string(pages)}, {year}, {escape_sql_string(indexing)}, {escape_sql_string(quartile)}, {escape_sql_string(authors)}, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;""")

        # Attribute to CSE department
        out_lines.append(f"INSERT INTO publication_departments (publication_id, department_id) VALUES ('{pub_uuid}', '{CSE_DEPT_ID}') ON CONFLICT (publication_id, department_id) DO NOTHING;")

    # Publication-Faculty links
    fac_pub_rows = table_data.get("faculty_publications", [])
    author_orders = {}
    for row in fac_pub_rows:
        p_id = int(row[0])
        f_id = int(row[1])
        if p_id in legacy_pub_map and f_id in legacy_faculty_map:
            p_uuid = legacy_pub_map[p_id]
            f_uuid = legacy_faculty_map[f_id]
            order = author_orders.get(p_uuid, 0) + 1
            author_orders[p_uuid] = order
            out_lines.append(f"""INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('{p_uuid}', '{f_uuid}', 'Faculty Co-Author', {order})
ON CONFLICT (publication_id, author_order) DO NOTHING;""")

    out_lines.append("")

    # 11. Sponsored Projects
    out_lines.append("-- 11. Sponsored Projects")
    proj_rows = table_data.get("projects", [])
    for row in proj_rows:
        leg_id = int(row[0])
        proj_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.project.{leg_id}"))
        legacy_proj_map[leg_id] = proj_uuid

        title = row[1] or "Sponsored Research Project"
        status = row[2] or "Ongoing"
        ref_no = row[3] or ""
        sponsor = row[4] or "Government of India"
        amount = escape_sql_num(row[5], 0.00)
        year = escape_sql_year(row[7])
        pi = row[10] or "Lead PI"
        co_pi = row[11] or ""
        investigators = f"{pi}" + (f", {co_pi}" if co_pi else "")

        out_lines.append(f"""INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('{proj_uuid}', {escape_sql_string(title)}, {escape_sql_string(ref_no)}, {escape_sql_string(sponsor)}, {escape_sql_string(status)}, {year}, {amount}, '{CSE_DEPT_ID}', {escape_sql_string(investigators)}, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;""")

        out_lines.append(f"INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('{proj_uuid}', '{CSE_DEPT_ID}', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;")

    # Project-Faculty links
    fac_proj_rows = table_data.get("faculty_projects", [])
    for row in fac_proj_rows:
        p_id = int(row[0])
        f_id = int(row[1])
        if p_id in legacy_proj_map and f_id in legacy_faculty_map:
            p_uuid = legacy_proj_map[p_id]
            f_uuid = legacy_faculty_map[f_id]
            out_lines.append(f"""INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('{p_uuid}', '{f_uuid}', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;""")

    out_lines.append("")

    # 12. Patents
    out_lines.append("-- 12. Patents")
    pat_rows = table_data.get("patents", [])
    for row in pat_rows:
        leg_id = int(row[0])
        pat_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.patent.{leg_id}"))
        legacy_pat_map[leg_id] = pat_uuid

        title = row[1] or "Patent Record"
        status = row[2] or "Published"
        ref_no = row[3] or ""
        year = escape_sql_year(row[4])
        fdate = escape_sql_date(row[7])
        gdate = escape_sql_date(row[8])
        authors = row[10] or "NITH Inventors"

        out_lines.append(f"""INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('{pat_uuid}', {escape_sql_string(title)}, {escape_sql_string(status)}, {escape_sql_string(ref_no)}, {escape_sql_string(ref_no if status == 'Granted' else None)}, {year}, {fdate}, {gdate}, {escape_sql_string(authors)}, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;""")

        out_lines.append(f"INSERT INTO patent_departments (patent_id, department_id) VALUES ('{pat_uuid}', '{CSE_DEPT_ID}') ON CONFLICT (patent_id, department_id) DO NOTHING;")

    # Patent-Faculty links
    fac_pat_rows = table_data.get("faculty_patents", [])
    inventor_orders = {}
    for row in fac_pat_rows:
        p_id = int(row[0])
        f_id = int(row[1])
        if p_id in legacy_pat_map and f_id in legacy_faculty_map:
            p_uuid = legacy_pat_map[p_id]
            f_uuid = legacy_faculty_map[f_id]
            order = inventor_orders.get(p_uuid, 0) + 1
            inventor_orders[p_uuid] = order
            out_lines.append(f"""INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('{p_uuid}', '{f_uuid}', 'Faculty Inventor', {order})
ON CONFLICT (patent_id, inventor_order) DO NOTHING;""")

    out_lines.append("")

    # 13. Consultancies
    out_lines.append("-- 13. Consultancies")
    cons_rows = table_data.get("consultancies", [])
    for row in cons_rows:
        leg_id = int(row[0])
        cons_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.consultancy.{leg_id}"))
        legacy_cons_map[leg_id] = cons_uuid

        ref_no = row[1] or ""
        title = row[2] or "Consultancy Project"
        client = row[3] or "Industry Client"
        amount = escape_sql_num(row[4], 0.00)
        year = escape_sql_year(row[5])
        status = row[7] or "Completed"
        authors = row[8] or ""

        out_lines.append(f"""INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('{cons_uuid}', '{CSE_DEPT_ID}', {escape_sql_string(title)}, {escape_sql_string(client)}, {escape_sql_string(ref_no)}, {escape_sql_string(status)}, {amount}, {year}, {escape_sql_string(authors)})
ON CONFLICT (id) DO NOTHING;""")

    # Consultancy-Faculty links
    fac_cons_rows = table_data.get("faculty_consultancies", [])
    for row in fac_cons_rows:
        c_id = int(row[0])
        f_id = int(row[1])
        if c_id in legacy_cons_map and f_id in legacy_faculty_map:
            c_uuid = legacy_cons_map[c_id]
            f_uuid = legacy_faculty_map[f_id]
            out_lines.append(f"""INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('{c_uuid}', '{f_uuid}', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;""")

    out_lines.append("")

    # 14. Research Supervisions
    out_lines.append("-- 14. Research Supervisions")
    sup_rows = table_data.get("research_supervisions", [])
    for row in sup_rows:
        leg_id = int(row[0])
        sup_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.supervision.{leg_id}"))
        legacy_sup_map[leg_id] = sup_uuid

        stype_id = int(row[1]) if row[1] is not None else 2
        plevel = SUPERVISION_TYPE_MAP.get(stype_id, "PhD")
        sname = row[2] or "Research Scholar"
        roll = row[3] or ""
        topic = row[4] or "Dissertation Thesis"
        status = row[5] or "Ongoing"
        co_sup = row[8] or ""

        out_lines.append(f"""INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('{sup_uuid}', '{CSE_DEPT_ID}', '{plevel}', {escape_sql_string(sname)}, {escape_sql_string(roll)}, {escape_sql_string(topic)}, {escape_sql_string(status)}, {escape_sql_string(co_sup)})
ON CONFLICT (id) DO NOTHING;""")

    # Supervision-Faculty links
    fac_sup_rows = table_data.get("faculty_research_supervisions", [])
    for row in fac_sup_rows:
        s_id = int(row[0])
        f_id = int(row[1])
        if s_id in legacy_sup_map and f_id in legacy_faculty_map:
            s_uuid = legacy_sup_map[s_id]
            f_uuid = legacy_faculty_map[f_id]
            out_lines.append(f"""INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('{s_uuid}', '{f_uuid}', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;""")

    out_lines.append("")

    # 15. Events
    out_lines.append("-- 15. Events")
    event_rows = table_data.get("events", [])
    for row in event_rows:
        leg_id = int(row[0])
        ev_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.event.{leg_id}"))
        legacy_event_map[leg_id] = ev_uuid

        title = row[1] or "Academic Event"
        etype = row[3] or "Workshop"
        venue = row[4] or "NIT Hamirpur"
        sponsor = row[5] or "TEQIP / Self-Sponsored"
        sdate = escape_sql_date(row[6])
        if sdate == "NULL":
            sdate = "'2024-01-01'"
        edate = escape_sql_date(row[7])
        year = 2024

        out_lines.append(f"""INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('{ev_uuid}', '{CSE_DEPT_ID}', {escape_sql_string(title)}, {escape_sql_string(etype)}, {escape_sql_string(venue)}, {escape_sql_string(sponsor)}, {sdate}, {edate}, {year})
ON CONFLICT (id) DO NOTHING;""")

    # Event-Faculty links
    fac_event_rows = table_data.get("faculty_events", [])
    for row in fac_event_rows:
        e_id = int(row[0])
        f_id = int(row[1])
        if e_id in legacy_event_map and f_id in legacy_faculty_map:
            e_uuid = legacy_event_map[e_id]
            f_uuid = legacy_faculty_map[f_id]
            out_lines.append(f"""INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('{e_uuid}', '{f_uuid}', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;""")

    out_lines.append("")

    # 16. Students
    out_lines.append("-- 16. Students Registry")
    student_rows = table_data.get("students", [])
    seen_student_rolls = set()
    for row in student_rows:
        name = row[1] or "Student"
        roll = (row[2] or f"ROLL-{row[0]}").strip()
        email = row[3] or f"{roll.lower()}@nith.ac.in"
        photo = row[4] or ""
        prg_id = int(row[5]) if row[5] is not None else 1
        prg_uuid = PROGRAM_MAP.get(prg_id, "66666666-6666-6666-6666-666666666661")
        sem = int(row[6]) if row[6] is not None else 1
        adm_year = int(row[7]) if row[7] is not None else 2023

        roll_key = (adm_year, roll.upper())
        if roll_key in seen_student_rolls:
            continue
        seen_student_rolls.add(roll_key)

        out_lines.append(f"""INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('{CSE_DEPT_ID}', '{prg_uuid}', {escape_sql_string(roll)}, {escape_sql_string(name)}, {adm_year}, {sem}, {escape_sql_string(email)}, {escape_sql_string(photo)})
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;""")

    out_lines.append("")

    # 17. PhD Scholars
    out_lines.append("-- 17. PhD Scholars Registry")
    phd_rows = table_data.get("phd_scholars", [])
    for row in phd_rows:
        name = row[1] or "PhD Scholar"
        roll = row[2] or ""
        email = row[3] or ""
        sup = row[4] or "Supervisor"
        status = row[6] or "pursuing"
        title = row[8] or ""
        time_note = row[12] or ""

        out_lines.append(f"""INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(name)}, {escape_sql_string(roll)}, {escape_sql_string(title)}, {escape_sql_string(sup)}, {escape_sql_string(status)}, {escape_sql_string(email)}, {escape_sql_string(time_note)});""")

    out_lines.append("")

    # 18. Staff
    out_lines.append("-- 18. Staff Registry")
    staff_rows = table_data.get("staff", [])
    for row in staff_rows:
        name = row[1] or "Staff Member"
        phone = row[2] or ""
        email = row[3] or ""
        desig = row[4] or "Technical Assistant"
        photo = row[5] or ""
        time_note = row[6] or ""

        out_lines.append(f"""INSERT INTO staff (department_id, full_name, designation, email, phone, photo_url, time_note)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(name)}, {escape_sql_string(desig)}, {escape_sql_string(email)}, {escape_sql_string(phone)}, {escape_sql_string(photo)}, {escape_sql_string(time_note)});""")

    out_lines.append("")

    # 19. Labs & Equipment
    out_lines.append("-- 19. Labs & Equipment")
    lab_rows = table_data.get("labs", [])
    for row in lab_rows:
        leg_id = int(row[0])
        lab_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"nith.lab.{leg_id}"))
        legacy_lab_map[leg_id] = lab_uuid

        title = row[1] or "Department Laboratory"
        desc = row[2] or ""
        oic = row[4] or ""
        tech = row[5] or ""

        out_lines.append(f"""INSERT INTO labs (id, department_id, name, description, raw_in_charge_name, technician_name)
VALUES ('{lab_uuid}', '{CSE_DEPT_ID}', {escape_sql_string(title)}, {escape_sql_string(desc)}, {escape_sql_string(oic)}, {escape_sql_string(tech)})
ON CONFLICT (id) DO NOTHING;""")

    eq_rows = table_data.get("equipment", [])
    for row in eq_rows:
        name = row[1] or "Hardware / Software Asset"
        qty = int(row[2]) if row[2] is not None else 1
        pdate = escape_sql_date(row[3])
        stock = int(row[4]) if row[4] is not None else 1
        inv = row[5] or ""
        indenter = row[6] or ""
        vendor = row[7] or ""
        contact = row[8] or ""
        amount = escape_sql_num(row[9], 0.00)

        out_lines.append(f"""INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(name)}, {qty}, {stock}, {amount}, {pdate}, {escape_sql_string(vendor)}, {escape_sql_string(inv)}, {escape_sql_string(indenter)}, {escape_sql_string(contact)});""")

    out_lines.append("")

    # 20. Placement Stats
    out_lines.append("-- 20. Placement Stats")
    place_rows = table_data.get("placement_stats", [])
    for row in place_rows:
        branch = row[1] or "B.Tech CSE"
        year = escape_sql_year(row[2])
        cands = int(row[3]) if row[3] is not None else 0
        placed = int(row[4]) if row[4] is not None else 0
        jobs = int(row[5]) if row[5] is not None else 0
        max_ctc = escape_sql_num(row[6], None)

        out_lines.append(f"""INSERT INTO placement_stats (department_id, year, programme_branch, graduating_count, placed_count, jobs_offered_count, highest_package_lpa)
VALUES ('{CSE_DEPT_ID}', {year}, {escape_sql_string(branch)}, {cands}, {placed}, {jobs}, {max_ctc})
ON CONFLICT (department_id, year, programme_branch) WHERE deleted_at IS NULL DO UPDATE SET graduating_count = EXCLUDED.graduating_count, placed_count = EXCLUDED.placed_count, jobs_offered_count = EXCLUDED.jobs_offered_count, highest_package_lpa = EXCLUDED.highest_package_lpa;""")

    out_lines.append("")

    # 21. Announcements & Posts
    out_lines.append("-- 21. Announcements & Posts")
    ann_rows = table_data.get("announcements", [])
    for row in ann_rows:
        title = row[1] or "Announcement"
        body = row[2] or ""
        is_priv = True if str(row[3]) in ("1", "true") else False
        pdate = escape_sql_date(row[4])
        if pdate == "NULL":
            pdate = "CURRENT_DATE"

        out_lines.append(f"""INSERT INTO announcements (department_id, title, body, publish_date, is_private)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(title)}, {escape_sql_string(body)}, {pdate}, {'TRUE' if is_priv else 'FALSE'});""")

    post_rows = table_data.get("posts", [])
    for row in post_rows:
        cat = row[1] or "Achievement"
        title = row[2] or "Post"
        body = row[3] or ""
        pdate = escape_sql_date(row[6])
        if pdate == "NULL":
            pdate = "CURRENT_DATE"

        out_lines.append(f"""INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(cat)}, {escape_sql_string(title)}, {escape_sql_string(body)}, {pdate});""")

    out_lines.append("")

    # 22. About & HOD & Slides
    out_lines.append("-- 22. About Sections, HOD Message & Home Slides")
    about_rows = table_data.get("about_sections", [])
    for row in about_rows:
        title = row[1] or "About Section"
        desc = row[2] or ""
        out_lines.append(f"""INSERT INTO about_sections (department_id, title, body)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(title)}, {escape_sql_string(desc)});""")

    hod_rows = table_data.get("hod_messages", [])
    for row in hod_rows:
        name = row[2] or "Head of Department"
        msg = row[3] or "Welcome to the Department"
        img = row[4] or "/hod.jpg"
        out_lines.append(f"""INSERT INTO hod_messages (department_id, hod_name, message, image_url)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(name)}, {escape_sql_string(msg)}, {escape_sql_string(img)});""")

    slide_rows = table_data.get("home_slides", [])
    for row in slide_rows:
        img = row[1] or ""
        out_lines.append(f"""INSERT INTO home_slides (department_id, image_url)
VALUES ('{CSE_DEPT_ID}', {escape_sql_string(img)});""")

    out_lines.append("")

    # 23. Refresh Materialized Views
    out_lines.append("-- 23. Refresh Materialized Views")
    out_lines.append("REFRESH MATERIALIZED VIEW v_faculty_kpis;")
    out_lines.append("REFRESH MATERIALIZED VIEW v_department_kpis;")
    out_lines.append("REFRESH MATERIALIZED VIEW v_institute_kpis;")
    out_lines.append("")
    out_lines.append("COMMIT;")

    print(f"Writing {len(out_lines)} SQL statements to {OUTPUT_SQL_PATH}...")
    with open(OUTPUT_SQL_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(out_lines))
    print("Done generating SQL seed script!")

if __name__ == "__main__":
    main()
