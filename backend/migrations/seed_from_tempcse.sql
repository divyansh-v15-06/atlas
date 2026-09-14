-- ============================================================================
-- Automated Data Seeding from tempcsebase live_export.sql into PostgreSQL
-- ============================================================================
BEGIN;

-- 1. Metric Sources
INSERT INTO metric_sources (id, code, name) VALUES ('44444444-4444-4444-4444-444444444441', 'SCOPUS', 'Elsevier Scopus') ON CONFLICT (code) DO NOTHING;
INSERT INTO metric_sources (id, code, name) VALUES ('44444444-4444-4444-4444-444444444442', 'GOOGLE_SCHOLAR', 'Google Scholar Citations') ON CONFLICT (code) DO NOTHING;
INSERT INTO metric_sources (id, code, name) VALUES ('44444444-4444-4444-4444-444444444443', 'ORCID', 'ORCID Open Researcher Contributor ID') ON CONFLICT (code) DO NOTHING;

-- 2. Faculty & User Accounts
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('af3db2f6-2cd3-587e-9762-0f94be8eb674', 'lalit@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Prof. Lalit Kumar Awasthi', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('af3db2f6-2cd3-587e-9762-0f94be8eb674', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'af3db2f6-2cd3-587e-9762-0f94be8eb674', 'CS01', 'lalit@nith.ac.in', 'Prof. Lalit Kumar Awasthi', 'Professor', TRUE, '254420', 'https://portfolios.nith.ac.in/uploads/member_details/58.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-lalit-kumar-awasthi-', 1, 'Mobile distributed systems, Fault tolerance, Sensor Networks, P2P networks, Network Security')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('bfb209c7-3e80-531b-ab07-7e9829b6f9be', '22222222-2222-2222-2222-222222222222', 'Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 1, 'faculty', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('bf67a867-677d-5795-b49a-59ca9b7f4708', 'kd@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr.(Mrs.) Kamlesh Dutta', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('bf67a867-677d-5795-b49a-59ca9b7f4708', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'bf67a867-677d-5795-b49a-59ca9b7f4708', 'CS02', 'kd@nith.ac.in', 'Dr.(Mrs.) Kamlesh Dutta', 'Associate Professor', TRUE, '', 'https://portfolios.nith.ac.in/uploads/member_details/60.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-mrs-kamlesh-dutta-', 2, 'Computer Science & Engineering')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', '22222222-2222-2222-2222-222222222222', 'Associate Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 2, 'faculty', '33007428-2ecd-5b52-93aa-b6849142c098') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('62bed2c9-f242-5555-ba4c-2497b12a30d2', 'teek@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. T P Sharma', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('62bed2c9-f242-5555-ba4c-2497b12a30d2', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', '62bed2c9-f242-5555-ba4c-2497b12a30d2', 'CS03', 'teek@nith.ac.in', 'Dr. T P Sharma', 'Associate Professor', TRUE, '1972254426', 'https://portfolios.nith.ac.in/uploads/member_details/28.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-t-p-sharma-', 3, 'Distributed systems, Wireless Sensor Networks, MANETs & VANETs')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', '22222222-2222-2222-2222-222222222222', 'Associate Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 3, 'faculty', '8f3440cb-d43b-5454-a7fd-9f9179831f9f') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('cd1b6d9c-1170-58fa-aad0-dba1ef327a42', 'sid@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Siddhartha Chauhan', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('cd1b6d9c-1170-58fa-aad0-dba1ef327a42', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'cd1b6d9c-1170-58fa-aad0-dba1ef327a42', 'CS04', 'sid@nith.ac.in', 'Dr. Siddhartha Chauhan', 'Associate Professor', TRUE, '254428', 'https://portfolios.nith.ac.in/uploads/member_details/62.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-siddhartha-chauhan-', 4, 'Computer Science and Engineering')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', '22222222-2222-2222-2222-222222222222', 'Associate Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 4, 'faculty', '9cf82300-a051-548f-b5b1-f2dfd9a1f263') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('cdc5ffcd-fae3-59c2-a146-10ef5299328b', 'naveen@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Naveen Chauhan', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('cdc5ffcd-fae3-59c2-a146-10ef5299328b', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'cdc5ffcd-fae3-59c2-a146-10ef5299328b', 'CS05', 'naveen@nith.ac.in', 'Dr. Naveen Chauhan', 'Associate Professor', TRUE, '1972254432', 'https://portfolios.nith.ac.in/uploads/member_details/63.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-naveen-chauhan-', 5, 'Mobile Wireless Networks, Vehicular Ad hoc Netwroks, Internet of Things')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', '22222222-2222-2222-2222-222222222222', 'Associate Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 5, 'faculty', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('4a9619c2-2222-5925-b200-d08ef6cf287c', 'pardeep@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Pardeep Singh', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('4a9619c2-2222-5925-b200-d08ef6cf287c', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('4a251956-1179-50e2-bf7e-f3be7d5574e2', '4a9619c2-2222-5925-b200-d08ef6cf287c', 'CS07', 'pardeep@nith.ac.in', 'Dr. Pardeep Singh', 'Associate Professor', TRUE, '254436', 'https://portfolios.nith.ac.in/uploads/member_details/65.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-pardeep-singh-', 6, 'Natural Language Processing, Artificial Intelligence')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('4a251956-1179-50e2-bf7e-f3be7d5574e2', '22222222-2222-2222-2222-222222222222', 'Associate Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 7, 'faculty', '4a251956-1179-50e2-bf7e-f3be7d5574e2') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('43d5b4be-369a-5ed7-a68d-e79cbda8cfc7', 'rajeev@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Rajeev Kumar', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('43d5b4be-369a-5ed7-a68d-e79cbda8cfc7', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', '43d5b4be-369a-5ed7-a68d-e79cbda8cfc7', 'CS09', 'rajeev@nith.ac.in', 'Dr. Rajeev Kumar', 'Assistant Professor Grade-I', TRUE, '254434', 'https://portfolios.nith.ac.in/uploads/member_details/64.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/rajeev-kumar-', 7, 'Computer Networks, Wireless Networks, IoT')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 9, 'faculty', '8baebe79-6e19-545b-a306-0d8b8ca2382b') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('74bc7fb8-fd39-541b-9bc6-b3773b778f9f', 'nitin@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Nitin Gupta', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('74bc7fb8-fd39-541b-9bc6-b3773b778f9f', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', '74bc7fb8-fd39-541b-9bc6-b3773b778f9f', 'CS010', 'nitin@nith.ac.in', 'Dr. Nitin Gupta', 'Assistant Professor Grade-I', TRUE, '254416', 'https://portfolios.nith.ac.in/uploads/member_details/66.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/nitin-gupta-', 8, 'Wireless Networks, Cognitive Radio Networks, IoT, Fog Computing, Internet of Healthcare Things, Internet of Vehicles')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 10, 'faculty', '6ba9979b-078d-563a-ae15-44354e3c8fb0') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('8ae5458d-b4aa-59ec-8700-d7cde7f8dcf0', 'dpm@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Dharmendra Prasad Mahato', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('8ae5458d-b4aa-59ec-8700-d7cde7f8dcf0', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', '8ae5458d-b4aa-59ec-8700-d7cde7f8dcf0', 'CS011', 'dpm@nith.ac.in', 'Dr. Dharmendra Prasad Mahato', 'Assistant Professor Grade-I', TRUE, '9918217024', 'https://portfolios.nith.ac.in/uploads/member_details/199.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-dharmendra-prasad-mahato', 9, 'Distributed Computing')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 11, 'faculty', '6fca9444-24e9-5214-8602-158f38f353ec') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('701ce252-d532-5dba-a4db-efbe95afbb43', 'ayadav@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Arun Kumar Yadav', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('701ce252-d532-5dba-a4db-efbe95afbb43', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', '701ce252-d532-5dba-a4db-efbe95afbb43', 'CS012', 'ayadav@nith.ac.in', 'Dr. Arun Kumar Yadav', 'Assistant Professor Grade-I', TRUE, '01972254411', 'https://portfolios.nith.ac.in/uploads/member_details/334.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-arun-kumar-yadav', 10, 'Information Retrieval, Machine Learning, Database Indexing')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 12, 'faculty', 'bab88791-e99c-561e-986e-2a99c8c84b19') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('a0b27644-4248-5b61-8859-ba7bacc5953a', 'mohit@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Mohit Kumar', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('a0b27644-4248-5b61-8859-ba7bacc5953a', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('88d09aab-214e-509e-8038-c6bd8ddb63c7', 'a0b27644-4248-5b61-8859-ba7bacc5953a', 'CS013', 'mohit@nith.ac.in', 'Dr. Mohit Kumar', 'Assistant Professor Grade-I', TRUE, '1972254462', 'https://portfolios.nith.ac.in/uploads/member_details/374.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-mohit', 14, 'Artificial Intelligence, Machine Learning, Speech Processing, Automatic Speaker Recognition, NLP')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('88d09aab-214e-509e-8038-c6bd8ddb63c7', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 13, 'faculty', '88d09aab-214e-509e-8038-c6bd8ddb63c7') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('7ce25482-843e-518f-ba7a-0f1389cdbb10', 'jyoti.s@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Jyoti Srivastava', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('7ce25482-843e-518f-ba7a-0f1389cdbb10', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', '7ce25482-843e-518f-ba7a-0f1389cdbb10', 'CS014', 'jyoti.s@nith.ac.in', 'Dr. Jyoti Srivastava', 'Assistant Professor Grade-I', TRUE, '8780187406', 'https://portfolios.nith.ac.in/uploads/member_details/342.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-jyoti-srivastava', 12, 'Natural Language Processing, Artificial Intelligence')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 14, 'faculty', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('96be07b4-21c6-5b54-b351-40ce7ce6bd7a', 'dr.priyanka@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Priyanka', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('96be07b4-21c6-5b54-b351-40ce7ce6bd7a', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', '96be07b4-21c6-5b54-b351-40ce7ce6bd7a', 'CS015', 'dr.priyanka@nith.ac.in', 'Dr. Priyanka', 'Assistant Professor Grade-I', TRUE, '1972254424', 'https://portfolios.nith.ac.in/uploads/member_details/356.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-priyanka', 11, 'Adhoc Networks, Wirelss Sensor Networks, Vehicular Networks, Internet of Things')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 15, 'faculty', '7ea23dd5-a666-543f-b04d-fdc4563b500c') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('29b6e7b6-3075-5862-ab9f-6155b18fec08', 'sangeetas@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Sangeeta Sharma', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('29b6e7b6-3075-5862-ab9f-6155b18fec08', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('f78d864c-94e1-5cdf-9672-b2c891bb2abb', '29b6e7b6-3075-5862-ab9f-6155b18fec08', 'CS016', 'sangeetas@nith.ac.in', 'Dr. Sangeeta Sharma', 'Assistant Professor Grade-I', TRUE, '', 'https://portfolios.nith.ac.in/uploads/member_details/364.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-sangeeta-sharma', 13, 'Cloud Computing, Virtualization')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('f78d864c-94e1-5cdf-9672-b2c891bb2abb', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-I', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 16, 'faculty', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('102119ea-79bc-56e7-831a-2ba9a57a0adf', 'mkhalid@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Mohammad Khalid Pandit', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('102119ea-79bc-56e7-831a-2ba9a57a0adf', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('3d607ef3-b375-5ece-9f8b-84feb2ed4a16', '102119ea-79bc-56e7-831a-2ba9a57a0adf', 'CS017', 'mkhalid@nith.ac.in', 'Dr. Mohammad Khalid Pandit', 'Assistant Professor Grade-II', TRUE, '', 'https://portfolios.nith.ac.in/uploads/member_details/405.jpg', 'https://portfolios.nith.ac.in/index.php/?/nith/dr-mohammad-khalid-pandit', 15, 'Deep Learning, Edge Computing and Machine Learning')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('3d607ef3-b375-5ece-9f8b-84feb2ed4a16', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-II', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 17, 'faculty', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('f4f65c47-3b55-58c2-9f92-0e924244ec4c', 'ajaymallick@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Ajay Kumar Mallick', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('f4f65c47-3b55-58c2-9f92-0e924244ec4c', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'f4f65c47-3b55-58c2-9f92-0e924244ec4c', 'CS018', 'ajaymallick@nith.ac.in', 'Dr. Ajay Kumar Mallick', 'Assistant Professor Grade-II', TRUE, '', 'https://portfolios.nith.ac.in/uploads/member_details/378.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-ajay-kumar-mallick', 17, 'Computer Vision, Machine Learning, Content based Image and Video Retrieval, Digital Image Security and Analysis')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-II', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 18, 'faculty', '0bdba158-8848-57a1-8223-ccdf001d9c5b') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('03b3b4aa-7e39-5b53-952e-6da1e6ff061b', 'robin.bhadoria@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Robin Singh Bhadoria', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('03b3b4aa-7e39-5b53-952e-6da1e6ff061b', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', '03b3b4aa-7e39-5b53-952e-6da1e6ff061b', 'CS020', 'robin.bhadoria@nith.ac.in', 'Dr. Robin Singh Bhadoria', 'Assistant Professor Grade-II', TRUE, '9329744955', 'https://portfolios.nith.ac.in/uploads/member_details/399.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-robin-singh-bhadoria', 19, 'Service-Oriented Archiecture, Big Data Analytics, Internet of Things (IoT)')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-II', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 20, 'faculty', '7f377458-de96-52a7-b8cf-04e50369469a') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('5fd276c6-71bb-5513-9fed-b3ca64ea4db6', 'ram.sharma@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Ram Prakash Sharma', TRUE, TRUE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('5fd276c6-71bb-5513-9fed-b3ca64ea4db6', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', '5fd276c6-71bb-5513-9fed-b3ca64ea4db6', 'CS021', 'ram.sharma@nith.ac.in', 'Dr. Ram Prakash Sharma', 'Assistant Professor Grade-II', TRUE, '1972250102', 'https://portfolios.nith.ac.in/uploads/member_details/404.jpg', 'https://portfolios.nith.ac.in/index.php?/nith/dr-ram-prakash-sharma', 18, 'Explainable AI, Deep Learning, Biometric Security, Machine Learning')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', '22222222-2222-2222-2222-222222222222', 'Assistant Professor Grade-II', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 21, 'faculty', '56b955eb-618e-5dcb-ac02-f8404a61a048') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('d55bcde5-9942-5320-b773-170dbb81a546', 'pkdhiman@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Pushpender Kumar', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('d55bcde5-9942-5320-b773-170dbb81a546', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('8f8cf312-11a9-55d1-b838-9fbb14edb2f4', 'd55bcde5-9942-5320-b773-170dbb81a546', 'TF042', 'pkdhiman@nith.ac.in', 'Dr. Pushpender Kumar', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730566751/pushpendra_j9zwft.jpg', 'fac-42', 0, 'Wireless sensor networks')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('8f8cf312-11a9-55d1-b838-9fbb14edb2f4', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 42, 'faculty', '8f8cf312-11a9-55d1-b838-9fbb14edb2f4') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('2f71f3e7-ed78-5f1f-9efe-e7ef8fa8d8b9', 'poojas@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Pooja Sharma', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('2f71f3e7-ed78-5f1f-9efe-e7ef8fa8d8b9', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('e0f136b4-3be3-52a4-8ae0-fbd435e22d98', '2f71f3e7-ed78-5f1f-9efe-e7ef8fa8d8b9', 'TF043', 'poojas@nith.ac.in', 'Dr. Pooja Sharma', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dha8atrgz/image/upload/v1730799923/WhatsApp_Image_2024-11-04_at_11.01.53_AM_rrb7hg.jpg', 'https://www.linkedin.com/in/pooja-sharma-91a6b9269', 0, 'Software Engineering, software process improvement, Fault prediction, Machine learning')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('e0f136b4-3be3-52a4-8ae0-fbd435e22d98', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 43, 'faculty', 'e0f136b4-3be3-52a4-8ae0-fbd435e22d98') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('79568c4d-e456-54a1-b39c-bf38d6713a46', 'tanuj@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Tanuj Wala', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('79568c4d-e456-54a1-b39c-bf38d6713a46', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('93a853b0-b5ce-5ed1-b715-f88f25ed9e76', '79568c4d-e456-54a1-b39c-bf38d6713a46', 'TF045', 'tanuj@nith.ac.in', 'Dr. Tanuj Wala', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730563085/tanuj_wala_hjzkiq.jpg', 'http://linkedin.com/in/dr-tanuj-wala-380767114', 0, 'Wireless sensor networks, Efficient Data Handling in Internet of Things, Big Data.')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('93a853b0-b5ce-5ed1-b715-f88f25ed9e76', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 45, 'faculty', '93a853b0-b5ce-5ed1-b715-f88f25ed9e76') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('d58a47c5-99d5-5db8-b861-838e336fa75a', 'mukulkmajhi@gmail.com', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Mukul Majhi', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('d58a47c5-99d5-5db8-b861-838e336fa75a', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('02aa78ef-5966-5e7d-afd9-45f788cf1fdc', 'd58a47c5-99d5-5db8-b861-838e336fa75a', 'TF046', 'mukulkmajhi@gmail.com', 'Dr. Mukul Majhi', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730563155/mukul_majhi_wb8okx.jpg', 'https://www.linkedin.com/in/dr-mukul-majhi-17b455130', 0, 'Content Based Image Retrieval, Image Security, AI&ML')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('02aa78ef-5966-5e7d-afd9-45f788cf1fdc', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 46, 'faculty', '02aa78ef-5966-5e7d-afd9-45f788cf1fdc') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('d2d7d0c6-5730-57d3-99a5-6a060afa078d', 'richa_cs@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Dr. Richa', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('d2d7d0c6-5730-57d3-99a5-6a060afa078d', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('97ce26f7-28ab-5679-9876-215ac22d6cff', 'd2d7d0c6-5730-57d3-99a5-6a060afa078d', 'TF047', 'richa_cs@nith.ac.in', 'Dr. Richa', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730563293/richa_shar_a_xz0fsl.jpg', 'www.linkedin.com/in/dr-richa-sharma-81a24b166', 0, 'Internet of things, Internet of vehicles, fault tolerance for data dissemination in Internet of vehicles, Wireless sensor network')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('97ce26f7-28ab-5679-9876-215ac22d6cff', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 47, 'faculty', '97ce26f7-28ab-5679-9876-215ac22d6cff') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('5f4f3f9c-e550-5f6e-8408-a890923eab8a', 'pooja_phdcse@nith.ac.ini', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Mrs. Pooja Rani', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('5f4f3f9c-e550-5f6e-8408-a890923eab8a', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('8986b4f9-5c4c-5047-8e5f-cde02c59b83a', '5f4f3f9c-e550-5f6e-8408-a890923eab8a', 'TF048', 'pooja_phdcse@nith.ac.ini', 'Mrs. Pooja Rani', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730563357/pooja_rani_xficdc.jpg', 'https://www.linkedin.com/in/pooja-rani-585b45ba', 0, 'AI, machine learning, deep learning, and image processing')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('8986b4f9-5c4c-5047-8e5f-cde02c59b83a', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 48, 'faculty', '8986b4f9-5c4c-5047-8e5f-cde02c59b83a') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('b095649f-6a68-5169-9143-4e85dd3fd6c7', 'pratibhasingh@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Mrs. Pratibha Singh', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('b095649f-6a68-5169-9143-4e85dd3fd6c7', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('0494529c-89b3-5038-9c24-c69fdd82942f', 'b095649f-6a68-5169-9143-4e85dd3fd6c7', 'TF049', 'pratibhasingh@nith.ac.in', 'Mrs. Pratibha Singh', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730563421/pratibha_cytkck.jpg', 'https://www.linkedin.com/in/pratibha-singh-13a100231', 0, 'Artificial intelligence')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('0494529c-89b3-5038-9c24-c69fdd82942f', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 49, 'faculty', '0494529c-89b3-5038-9c24-c69fdd82942f') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('a6dcead1-90de-5068-b4b7-a61c0ac20ec0', 'keshavkaundal@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Mr. Keshav Kaundal', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('a6dcead1-90de-5068-b4b7-a61c0ac20ec0', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('e0a19ad4-16dc-5113-8e43-588121443653', 'a6dcead1-90de-5068-b4b7-a61c0ac20ec0', 'TF050', 'keshavkaundal@nith.ac.in', 'Mr. Keshav Kaundal', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730566898/keshav_y1fmvr.jpg', 'http://linkedin.com/in/keshav-kaundal-18b2aa147', 0, 'Internet of Things')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('e0a19ad4-16dc-5113-8e43-588121443653', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 50, 'faculty', 'e0a19ad4-16dc-5113-8e43-588121443653') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
VALUES ('acd8be77-9cbe-5e61-9f5e-e3643a8faaa3', 'meenakshinayyer@nith.ac.in', '$2a$10$NkXIIu/dHZsBCyE4TsgJcOSrzctmqz00qwXSIhW6mmmrvKeUaI7GC', 'Mrs. Meenakshi Nayyer', TRUE, FALSE)
ON CONFLICT (email) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, password_hash = EXCLUDED.password_hash;
INSERT INTO user_roles (user_id, role_id)
VALUES ('acd8be77-9cbe-5e61-9f5e-e3643a8faaa3', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, role_id) DO NOTHING;
INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, portfolio_slug, sort_order, research_interests)
VALUES ('94f282ed-eed6-5d94-b67c-e524cfb954fa', 'acd8be77-9cbe-5e61-9f5e-e3643a8faaa3', 'TF051', 'meenakshinayyer@nith.ac.in', 'Mrs. Meenakshi Nayyer', 'Assistant Professor', FALSE, '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1730563500/meenkashi_wiegxb.jpg', 'https://www.linkedin.com/in/meenakshi-nayyer-48251024', 0, 'WSN, Software Engineering and Testing')
ON CONFLICT (employee_code) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, designation = EXCLUDED.designation, photo_url = EXCLUDED.photo_url, research_interests = EXCLUDED.research_interests;
INSERT INTO faculty_appointments (faculty_id, department_id, designation, is_primary, start_date)
VALUES ('94f282ed-eed6-5d94-b67c-e524cfb954fa', '22222222-2222-2222-2222-222222222222', 'Assistant Professor', TRUE, '2020-01-01')
ON CONFLICT DO NOTHING;
INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid) VALUES ('faculty', 51, 'faculty', '94f282ed-eed6-5d94-b67c-e524cfb954fa') ON CONFLICT (source_table, legacy_int_id) DO NOTHING;

-- 3. Faculty Profiles
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('bfb209c7-3e80-531b-ab07-7e9829b6f9be', '1980-05-15', '2005-08-01', 'https://scholar.google.com/citations?user=example', 'https://www.scopus.com/authid/detail.uri?authorId=123456', 'https://publons.com/researcher/123457', '0000-0002-1825-0097', 'https://www.researchgate.net/profile/Example', 'https://vidwan.inflibnet.ac.in/profile/123456', NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', NULL, NULL, 'https://scholar.google.com/citations?user=example', 'https://www.scopus.com/authid/detail.uri?authorId=37103209800', 'https://www.webofscience.com/wos/author/record/AAS-6212-2021', '0000-0001-9774-7917', 'https://www.reseaate.net/profile/Example_Name', 'https://vidwan.inflibnet.ac.in/profile/105471', NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', '1988-01-22', '2023-09-04', 'https://scholar.google.com/citations?user=tNA_6VYAAAAJ&hl=en&oi=ao', 'https://www.scopus.com/authid/detail.uri?authorId=57190793824', 'https://www.webofscience.com/wos/author/record/AAM-1260-2021', '0000-0002-4770-9506', 'https://www.researchgate.net/profile/Ajay-Mallick-3?ev=hdr_xprf', 'https://vidwan.inflibnet.ac.in/profile/463097', 'https://www.linkedin.com/feed/?trk=sem-ga_campid.14650114788_asid.151761418307_crid.657403558721_kw.linkedin%20login_d.c_tid.kwd-12704335873_n.g_mt.e_geo.9297884')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('4a251956-1179-50e2-bf7e-f3be7d5574e2', '1979-05-20', '2006-08-17', 'https://scholar.google.com/citations?hl=en&user=VRCMwpcAAAAJ&view_op=list_works', 'https://www.scopus.com/authid/detail.uri?authorId=55463318900', 'https://www.webofscience.com/wos/author/rid/AAZ-9884-2021', '0000-0002-4019-604X', 'https://www.researchgate.net/profile/Pardeep-Singh-2', 'https://vidwan.inflibnet.ac.in/profile/49071', 'https://www.linkedin.com/in/dr-pardeep-singh-b3861519/')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', '1991-11-01', '2023-10-04', 'https://scholar.google.com/citations?user=sH5WMDUAAAAJ&hl=en&gmla=AJ1KiT2cGGvXJDzWUS_8d_cu3kt_YIIUVug_RZDG4iT0DSIYqe6f4jW8g0rlts_NnxWGknrga2ohHzhT0R-s9jxh-nUzDp7NCYE1lYFzbWOe1g', NULL, 'https://www.webofscience.com/wos/author/record/IAN-9085-2023', '0000-0002-1851-2325', NULL, 'https://nith.irins.org//profile/463491', 'https://www.linkedin.com/in/ram-prakash-sharma-b3197a78/')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', '1973-06-11', '1996-11-14', 'https://scholar.google.com/citations?user=0ycxKQsAAAAJ&hl=en', 'https://www.scopus.com/authid/detail.uri?authorId=55922678900', 'https://publons.com/researcher/4804912/teek-sharma/', '0000-0002-6324-5457', NULL, 'https://vidwan.inflibnet.ac.in/profile/18381', 'https://www.linkedin.com/in/dr-t-p-sharma-0a0978b8/')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', '1984-06-11', '2019-10-03', 'https://scholar.google.co.in/citations?user=HE8DDFQAAAAJ&hl=en', NULL, NULL, NULL, 'https://www.researchgate.net/profile/Jyoti-Srivastava-4', NULL, 'https://in.linkedin.com/in/jyoti-srivastava-53973323')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', '1977-02-04', '2001-02-16', 'https://scholar.google.com/citations?user=C6TO36cAAAAJ&hl=en', 'https://www.scopus.com/authid/detail.uri?authorId=35218687800', NULL, '0000-0001-9347-9345', 'https://www.researchgate.net/profile/Naveen-Chauhan-5', NULL, NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('3d607ef3-b375-5ece-9f8b-84feb2ed4a16', '1990-09-13', '2023-08-25', 'https://scholar.google.com/citations?user=Iin9bCsAAAAJ&hl=en&authuser=2', NULL, NULL, '0000-0002-3755-3245', 'https://www.researchgate.net/profile/Mohammad-Khalid-Pandit', NULL, 'https://www.linkedin.com/in/mohammad-khalid-pandit-5b0a8a24/?originalSubdomain=in')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', '1973-06-13', '1997-09-06', 'http://scholar.google.co.in/citations?user=ecm-wIgAAAAJ', 'http://www.scopus.com/authid/detail.url?authorId=37048596000', 'https://www.webofscience.com/wos/author/record/ABD-4838-2021', '0000-0001-7851-7657', 'https://www.researchgate.net/profile/Siddhartha-Chauhan', '18382', 'https://in.linkedin.com/in/dr-siddhartha-chauhan-79846616')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('88d09aab-214e-509e-8038-c6bd8ddb63c7', NULL, '2020-06-08', NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', '1985-09-19', '2023-09-25', 'https://scholar.google.com/citations?user=p2J4ye8AAAAJ&hl=en', 'https://www.scopus.com/authid/detail.uri?authorId=54787398500', 'https://www.webofscience.com/wos/author/rid/H-4324-2013', '0000-0002-6314-4736', 'https://www.researchgate.net/profile/Robin-Bhadoria', 'https://vidwan.inflibnet.ac.in//profile/224383/MjI0Mzgz', 'https://in.linkedin.com/in/dr-robin-singh-bhadoria-569214b6')
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', '1978-01-01', '2018-11-20', NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;
INSERT INTO faculty_profiles (faculty_id, date_of_birth, date_of_joining, google_scholar_url, scopus_url, publons_url, orcid, research_gate_url, vidwan_url, linkedin_url)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', NULL, '2019-09-23', 'https://scholar.google.com/citations?hl=en&user=78gb3g8AAAAJ', NULL, 'https://publons.com/researcher/4805095/dr-priyanka-rathee/', NULL, NULL, 'https://portfolios.nith.ac.in/index.php?/nith/dr-priyanka', NULL)
ON CONFLICT (faculty_id) DO UPDATE SET google_scholar_url = EXCLUDED.google_scholar_url, scopus_url = EXCLUDED.scopus_url, orcid = EXCLUDED.orcid, linkedin_url = EXCLUDED.linkedin_url;

-- 4. Faculty Qualifications
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'B.Tech.(CSE)', 'TPCT College of Engineering (Marathwada University)', 1994);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'M.Tech.(CSE)', 'Kurukshetra University, Kurukshetra (University Campus)', 2000);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Ph.D(CSE)', 'Indian Institute of Technology, Roorkee, India', 2010);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'B.Tech', 'Uttar Pradesh Technical University, Lucknow, Uttar Pradesh', 2006);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'M.Tech', 'Indian Institute of Information Technology, Allahabad, Uttar Pradesh', 2009);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Ph.D.', 'Indian Institute of Information Technology, Allahabad, Uttar Pradesh', 2018);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'Ph.D', 'Indian Institute of Technology, Indore, India', 2020);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'M.Tech', 'University of Hyderabad, Hyderabad, India', 2015);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'B.Tech', 'Rajasthan Technical University, Kota, India', 2012);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'B.E CSE', 'Annamalai University', 2011);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'M.E CSE', 'Anna University', 2013);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Ph.D.', 'National Institute of Technology Srinagar', 2021);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'B.E', 'University Institute of Technology, Burdwan', 2013);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'M.Tech', 'Indian Institute of Technology (Indian School of Mines), Dhanbad', 2015);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Ph.D', 'Indian Institute of Technology (Indian School of Mines), Dhanbad', 2022);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'B.Tech. Computer Science and Engineering', 'Dr. Babasaheb Ambedkar Marathwada University', 1996);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'M.Tech. Computer Science and Engineering', 'Indian Institute of Technology Roorkee', 2003);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Ph.D Computer Science and Engineering', 'National Institute of Technology Hamirpur', 2013);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'B.Tech', 'Maharishi Dayanand University Rohtak', 1999);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'M.Tech', 'Punjab Engineering College Chandigarh', 2005);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Ph.D (Computer Science & Engineering)', 'National Institute of Technology Hamirpur', 2012);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'BTech', 'Maharashi Dayanand University, Rohtak, Haryana', 2008);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'MTech', 'Kurukshetra University, Haryana', 2011);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'PhD', 'Guru Jambheshwar University of Science & Technology, Hisar, Haryana', 2018);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'MS', 'Vladimir State Technical University (Russia)', 1989);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'MTech', 'Indian Institute of Technology, Delhi', 2006);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'PhD', 'Guru Gobind Singh Indraprastha University, Delhi', 2009);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Doctor of Philosophy (Ph.D.)', 'Indian Institute of Technology (IIT) Indore, MP', 2018);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Master of Technology (M.Tech.)', 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) Bhopal, MP', 2011);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Bachelor of Engineering (B.E.)', 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) Bhopal, MP', 2008);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'B.E. (Computer Engineering)', 'MDU Rohtak', 2004);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'M.Tech (Computer Engineering)', 'Kurukshetra University', 2006);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Ph.D. (Computer Engineering)', 'NSIT, University of Delhi', 2021);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', 'Postdoc', 'Ton Duc Thang University, Ho Chi Minh City, Vietnam', 2021);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', 'Ph.D.', 'Indian Institute of Technology Banaras Hindu University Varanasi, UP, India', 2018);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', 'Master of Technology', 'Atal Bihari Vajpayee-Indian Institute of Information Technology and Management Gwalior, Madhya Pradesh, India', 2013);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('6fca9444-24e9-5214-8602-158f38f353ec', 'Associate Member of The Institution of Electronics and Telecommunication Engineers (AMIETE)', 'The Institution of Electronics and Telecommunication Engineers (IETE), New Delhi, India', 2011);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', 'PH.D', 'UTU, DEHRADUN', 2016);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('4a251956-1179-50e2-bf7e-f3be7d5574e2', 'PhD', 'NIT Hamirpur', 2016);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('4a251956-1179-50e2-bf7e-f3be7d5574e2', 'B Tech', 'GNDU Amritsar', 2001);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'BE', 'RGPV, BHOPAL', 2006);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'MTech', 'MANIT, BHOPAL', 2011);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'PhD', 'MANIT, BHOPAL', 2017);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'BE', 'NITK Surathkal', 2005);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'MTech', 'NIT Hamirpur', 2011);
INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'PhD', 'NIT Hamirpur', 2021);

-- 5. Faculty Teaching Experiences
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', 'Assistant Professor GR-II', 'Computer Science and Engineering, NIT HAMIRPUR', '2019-09-23', '2023-08-22');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', 'Assistant Professor GR-I', 'Computer Science and Engineering, NIT HAMIRPUR', '2023-08-23', NULL);
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Assistant Professor (Adhoc)', 'SPMC, University of Delhi', '2016-07-25', '2018-01-04');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Assistant Professor (Adhoc)', 'BNC, University of Delhi', '2018-02-06', '2018-05-20');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Assistant Professor (Adhoc)', 'Department of Computer Science, University of Delhi', '2018-06-20', '2019-09-23');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Assistant Professor', 'DoCSE, National Institute of Technology, Hamirpur (H.P)', '2019-09-24', NULL);
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Assistant Professor', 'School of Computer Science and Engineering, VIT-AP University', '2022-07-09', '2023-05-31');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Assistant Professor', 'Department of Computer Science and Engineering, National institute of Technology Hamirpur', '2023-09-04', NULL);
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'Assistant Professor', 'Computer Science and Engineering', '2020-01-14', '2023-09-30');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'Assistant Professor G-II', 'Computer Science and Engineering', '2023-10-04', NULL);
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Associate Professor', 'Computer Science and Engineering Department , NIT Hamirpur', '2019-05-06', NULL);
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Assistant Professor', 'Computer Science and Engineering Department , NIT Hamirpur', '2012-07-27', '2019-05-05');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Sr.Lecturer', 'Computer Science and Engineering Department , NIT Hamirpur', '2007-07-27', '2012-07-26');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Lecturer', 'Computer Science and Engineering Department , Formerly REC Hamirpur,currently NIT Hamirpur', '1997-09-06', '2007-07-26');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Lecturer (On Contract)', 'Computer Science & Engineering NIT Hamirpur', '2005-08-17', '2006-08-02');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Assistant Professor Grade-I', 'Computer Science & Engineering NIT Hamirpur', '2006-08-03', '2023-09-22');
INSERT INTO faculty_teaching_experiences (faculty_id, designation, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Assistant Professor Grade-II', 'Computer Science & Engineering NIT Hamirpur', '2023-09-22', NULL);

-- 6. Faculty Administrative Experiences
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', 'FI(NAD)', 'NATIONAL INSTITUTE OF TECHNOLOGY HAMIRPUR', '2024-02-29', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('bab88791-e99c-561e-986e-2a99c8c84b19', 'Nodal Officer-NITH EOC', 'NATIONAL INSTITUTE OF TECHNOLOGY HAMIRPUR', '2020-02-12', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Assistant Director', 'Directorate of Technical Education, Vocational & Industrial Training, HP', '1995-01-30', '1996-08-13');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Deputy Director', 'HP State Electricity Regulatory Commission, Shimla', '2002-01-11', '2003-08-13');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Chairman cum Center In-charge, Central Counseling Board12 (CCB-12) and Central seat allocation Board-13 (CSAB-13)', 'National Institute of Technology Hamirpur', '2012-01-01', '2014-12-31');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Chairman, Senate for Undergraduate Studies (SUGC)', 'National Institute of Technology Hamirpur', '2012-10-08', '2014-01-07');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Program Incharge', 'IGNOU Program Study Centre, NIT Hamirpur', '2012-10-29', '2018-10-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Head of Department', 'Computer Science & Engineering Department, NIT Hamirpur', '2013-05-21', '2015-07-30');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Chairman, Committee for implementation of eOffice at NITH', 'National Institute of Technology Hamirpur', '2016-05-04', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Nodal Officer, National Knowledge Network (NKN)', 'National Institute of Technology Hamirpur', '2016-10-05', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Head of Department', 'Computer Centre, National Institute of Technology Hamirpur', '2016-10-05', '2018-10-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Deputy Registrar (Audit & Accounts) cum Deputy Registrar (Consultancy & Testing)', 'National Institute of Technology Hamirpur', '2018-11-06', '2019-02-13');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Associate Dean (Consultancy Projects & Testing)', 'National Institute of Technology Hamirpur', '2019-05-02', '2020-04-30');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Head of Department', 'Computer Science & Engineering Department, NIT Hamirpur', '2020-04-22', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Assistant Faculty In-charge (Technical Activities & Clubs)', 'NIT Hamirpur', '2019-12-03', '2020-08-10');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Assistant Nodal Officer (NIRF)', 'NIT Hamirpur', '2019-12-03', '2020-08-10');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Assistant Warden', 'AGH & PGH', '2020-05-08', '2020-08-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Departmental Counselor (DoCSE)', 'DoCSE, NIT Hamirpur', '2019-12-18', '2020-12-18');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'FI(Result Processing)', 'NIT Hamirpur', '2023-10-13', '2024-10-13');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'OIC (Artificial Intelligence and Robotics Lab)', 'DoCSE, NIT Hamirpur', '2020-02-17', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'OIC (CSEC Departmental Society)', 'DoCSE, NIT Hamirpur', '2020-02-19', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'OIC (Hindi)', 'DoCSE, NIT Hamirpur', '2022-05-23', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Assistant Faculty In-charge (AFI):Cultural Activities and Clubs- (Sangeet)', 'Department of Computer Science and Engineering, NIT Hamirpur', '2024-08-09', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Officer In-Charge (OIC) : Department Research Laboratory', 'Department of Computer Science and Engineering, NIT Hamirpur', '2024-02-23', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Officer In-Charge (OIC) :Department Infrastructure', 'Department of Computer Science and Engineering, NIT Hamirpur', '2024-02-23', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Associate Dean', 'Examination & Evaluation', '2020-04-30', '2021-12-27');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Associate Dean', 'Research Projects & Collaborations, Startup', '2021-12-28', '2022-01-07');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Coodinator', 'ISTE', '2006-08-02', '2008-08-03');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Cordinator', 'Video Conferencing', '2012-11-20', '2018-04-10');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Facuty In-Charge', 'Computre Centre', '2018-07-04', '2020-09-15');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Facuty In-Charge', 'Outsourced Multitasking Services', '2020-05-01', '2023-09-30');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'HoD', 'Computer Science & Engineering', '2022-09-06', '2024-09-25');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Nodal Officer', 'IIIT Una', '2015-09-16', '2018-07-24');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'OIC', 'Aravali Trainees Hostel', '2010-09-13', '2017-05-04');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Warden', 'Dhauladhar Boys Hostel', '2006-01-08', '2009-06-29');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Head of the Department', 'Computer Science & Enngineering Department, NIT Hamirpur', '2011-10-02', '2013-05-14');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Head of the Department', 'Computer Science & Enngineering Department, NIT Hamirpur', '2018-04-24', '2020-04-21');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Assistant Faculty Incharge (AFI)', 'E-Cell (Entrepreneurship Cell)', '2024-04-16', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Officer In-charge (OIC)', 'Departmental Library', '2024-02-23', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'Faculty Incharge (FI) NAD', 'NIT Hamirpur', '2024-02-23', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'OIC- Department Information', 'Computer Science and Engineering', '2024-02-23', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Warden Dhauladhar Boys Hostel', 'National Institute of Technology , Hamirpur', '2019-03-25', '2020-06-01');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Warden In charge(Boys Hostels)', 'National Institute of Technology , Hamirpur', '2020-06-01', '2020-08-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Incharge(Computer Centre)', 'Computer Centre , NIT Hamirpur', '2020-09-15', '2022-09-26');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Convener DDPC', 'Computer Science and Engineering , NIT Hamirpur', '2021-08-11', '2023-09-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Member SDPC', 'NIT Hamirpur', '2021-08-11', '2023-09-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Nodal Officer Digital India', 'NIT Hamirpur', '2018-05-03', '2019-05-01');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Warden Shivalik Boys Hostel', 'NIT Hamirpur', '2017-09-01', '2019-05-28');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Convener Departmental Post Graduate Committee(DPGC),CSED', 'NIT Hamirpur', '2018-07-16', '2020-02-16');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Coordinator Institute Website', 'NIT Hamirpur', '2012-10-18', '2014-01-07');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Coordinator Sports', 'NIT Hamirpur', '2014-01-07', '2025-07-27');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Coordinator (Administration)', 'IIIT,Una', '2014-07-21', '2016-03-01');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty In-Charge GLUG', 'NIT Hamirpur', '2011-11-08', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Lab in charge Microprocessor Lab ,CSED', 'NIT Hamirpur', '2008-05-01', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty-Incharge (Cultural Activities & Clubs)', 'Office of Dean (Student Welfare)', '2024-09-01', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Convenor, DDPC', 'Computer Science & Engineering', '2023-08-08', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Nodal Officer (Rashtriya Abhiskar Abhiyaan)', 'National Institute of Technology, Hamirpur', '2023-08-11', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty-Incharge (NCC Air Wing)', 'Office of Dean (Student Welfare)', '2021-07-20', '2025-02-10');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Convenor, DBPC', 'Computer Science & Engineering', '2021-08-12', '2023-08-08');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty-Incharge (Examination)', 'Office of Dean (Academics)', '2021-06-21', '2023-06-21');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Assistant Faculty-Incharge (Examination and Evaluation)', 'Office of Dean (Academics)', '2018-07-03', '2021-08-12');
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Center In-charge (CSAB 2025)', 'Office of Dean (Academics)', '2025-03-19', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Single Point of Contact (SPOC)', 'Smart India Hackathon 2025, NIT Hamirpur', '2025-08-28', NULL);
INSERT INTO faculty_administrative_experiences (faculty_id, role_title, organization, start_date, end_date)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Assistant Faculty In-charge (AFI):Google Developer Group', 'Technical Activities and Clubs', '2025-11-21', NULL);

-- 7. Faculty Honors
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Mahindra All India Talent Scholarship', 'Mahindra & Mahindra Ltd.', 1998);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'TCS Research Fellowship', 'Tata Consultancy Services', 1998);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Outstanding award for contribution to the Cisco Networking Academy Program', 'Cisco Networking Academy Program', 2001);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Selected for Contributory paper for main presentation under the Theme “Improving Quality through Attainment of Learning Outcomes” in the 3rd World Summit on Accreditation (WOSA 2016) Theme: Quality Assurance through Outcome Based Accreditation', 'WOSA 2016 18th- 20th March, 2016', 2016);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Consolation prize for paper “Reputation Base Trust for Mobile Agents', 'ADCON 2011 held during 16-18 Decempber, 2011 at NITK Surthkal', 2011);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Best Paper Award for the paper “Adoption of Video Confrencing in Technical Institutions – a Case Study of NIT Hamirpur”,', 'presented in the ISTE Section Annual Convention SAC-07 held during Novemeber 18-19, 2007 at NIT Hamirpur.', 2007);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Best Paper Award for Evaluating The Performance of Various Machine Learning Algorithms for Detecting DDoS Attacks in VANETS', '3rd International Conference on Innovations in Computing held on 12-13 December 2019 at CGC College of Engineering, Mohali, India', 2019);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Academic Editor', 'John Wiley & Sons, Inc. (USA)', 2023);
INSERT INTO faculty_honors (faculty_id, title, awarding_body, award_year)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'University Gold Medal', 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) Bhopal, MP', 2011);

-- 8. Faculty Exposures
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'London, UK International Conference on Computer and Information Technology (ICCIT 2014) at Toronto', 'Visited Oxford University while presenting paper at International Conference on Computer and Information Technology (ICCIT 2014) at Toronto', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Austin, Texas, US for presenting paper in 27th IEEE International Performance Computing and Communications Conference', 'Best Paper Award, Paper presentation:: T.P. Sharma, R.C. Joshi, Manoj Misra, “Tuning Data Reporting and Sensing for Continuous Monitoring in Wireless Sensor Networks,”', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Madrid, Spain for presenting paper in International Conference on Computer, Electrical, and Systems Sciences, and Engineering (ICCESSE 2012)', 'Paper presentation and Session Chair: T.P. Sharma, “Handling Mobility Using Virtual Grid in Static Wireless Sensor Networks”, International Conference on Computer, Electrical, and Systems Sciences, and Engineering (ICCESSE 2012)', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Perth, Australia for presenting paper in International Conference on Communications, Networking and Mobile Computing', 'Paper presentation and Session Chair: Vipan Arora, T.P. Sharma, K. Raj, “An Optimal Storage Node Placement in Wireless Sensor Networks,” International Conference on Communications, Networking and Mobile Computing, Perth, Australia, December 6-7, 2012.', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Toronto, Canada for presenting paper in International Conference on Computer and Information Technology (ICCIT 2014)', 'Paper presentation: K.P. Sharma, T.P. Sharma, “Load-Enabled Deployment and Sensing Range Optimization for Lifetime Enhancement of WSNs”, International Conference on Computer and Information Technology (ICCIT 2014)', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'New York, US for presenting paper in International Conference on Computer Networks and Systems Security (ICCNSS 2013)', 'Paper presentation: Kulwardhan Singh, T.P. Sharma, “REDD: Reliable Energy-efficient Data dissemination in wireless sensor network”, International Conference on Computer Networks and Systems Security (ICCNSS 2013), 05-06 June, 2013.', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Melbourne, Australia for presenting paper in International Conference on Computer and Automation Engineering (ICCAE)', 'Rakhi, T.P. Sharma " [PDF] from ieee.org A Review of Adaptive Hierarchical Data Dissemination Method in Mobile Wireless Sensor Network," International Conference on Computer and Automation Engineering (ICCAE)', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Cisco Networking Academy Training Programme visited Singapore 1999', 'Supported by Cisco Networking Academy and UNDP', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Cisco Networking Academy Training Programme visited Melbourne, Australia 2001', 'Supported by Cisco Networking Academy and UNDP', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Understanding Environmental Processes using Visualization Tools, South-Asian Countries conference on CACE, April 7-9 1999, Kathmandu, Nepal', 'Paper presentation', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Hybrid Framework for Information Extraction For Geographical Terms In Hindi Language Texts, IEEE NLP-KE 2005, 30th Oct to 1st Nov. 2005 Wuhan China', 'Paper presentation', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'MS from Vladimimir State University , Russia (erstwhile USSR)', 'Widely traveled European countries and various cities', '2023-01-01');
INSERT INTO faculty_exposures (faculty_id, title, description, start_date)
VALUES ('7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Chairperson, IEEE Young Professionals, Delhi Section', 'This position and opportunity gives me an exposure on national and international platform in terms of International collaboration', '2023-01-01');

-- 9. Expert Talks
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Introduction to Natural Language Processing', 'NIT Hamirpur', 'NIT Hamirpur', '2020-10-12', 'Machine Learning for Natural Language Processing (MNLP-2020)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Machine Learning for Natural Language Processing', 'Department of Computer Science & Engineering, at ITS Engineering College, Greater Noida', 'Department of Computer Science & Engineering, at ITS Engineering College, Greater Noida', '2021-02-22', 'ML-FDP''21 Program (MACHINE LEARNING)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'AI and its Applications in Architecture and Planning', 'Department of Architecture, National Institute of Technology, Hamirpur (H.P), India.', 'Department of Architecture, National Institute of Technology, Hamirpur (H.P), India.', '2024-10-14', 'e-Short Term Course (e-STC) on Information Science for Building Design and Urban Planning (ISBDUP), Dated 14th-18th October 2024.');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Handcrafted and Deep Feature Based Image and Video Retrieval', 'Department of Computer Science and Engineering, National Institute of Technology, Hamirpur (H.P), India.', 'Department of Computer Science and Engineering, National Institute of Technology, Hamirpur (H.P), India.', '2024-07-01', 'Online Short Term Course (eSTC) titled "Research Applications of Deep Learning" 2024 organised during 01-05 July 2024 by Department of Computer Science and Engineering, NIT Hamirpur');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', '(Key note speaker ) Artificial Intelligence and Data Analytics: From Dawn till Dusk & Beyond', 'Guru Jambheshwar University of Science and Technology, Hisar -125001, Haryana', 'Guru Jambheshwar University of Science and Technology, Hisar -125001, Haryana', '2024-03-18', 'One Week Online Faculty Development Programme (FDP) on “Artificial Intelligence and Data Analytics (AIDA-2024)” from 18-03-2024 to 23-03-2024.');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Artificial Intelligence powered Insight into Cyber Threat Intelligence: Challenges, Opportunities and Cyber Landscape', 'NIT Hamirpur', 'NIT Hamirpur', '2024-09-23', '3rd Short Term Course on Recent Trends in Networks & Communication: Cyber Security Challenges. (RTNC-2024) 23-28 September, 2024');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Cyber Security Awareness', 'NIT Hamirpur', 'NIT Hamirpur', '2024-11-29', 'Short Term Training Programme on Cyber Security and Procurement: Vigilance Awareness Week (VAW 2024), 29th November, 2024');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Exploring Defect Detection Applications Leveraging Deep Learning Architectures', 'NIT Kurukshetra', 'NIT Kurukshetra', '2024-09-12', 'STC on Machine Intelligence and Vision Algorithms (MIVA 2024) 12-16 September 2024');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Fabric Defect Detection using Deep Learning', 'NIT Jalandhar', 'NIT Jalandhar', '2024-02-19', 'short-term course (STC) on “Industry 4.0 challenges and interdependencies” sponsored by Agmatel Pvt ltd., during February 19th- 23rd, 2024.');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Work Life Balance', 'NIT Hamirpur', 'NIT Hamirpur', '2024-02-12', 'STTP" Advancing Pedagogical Practices and Teaching Excellence", 12-16 February, 2024');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Android Security', 'NIT Hamirpur', 'NIT Hamirpur', '2023-09-25', 'Short Term Course on “Recent Trends in Networks & Communication: Theory & Challenges (RTNC-2023)”, 25th-29th September, 2023');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Artificial Intelligence powered Cyber Threat: Challenges, Opportunities and Cyber Landscape', 'Jaypee Institute of Information Technology, Noida.', 'Jaypee Institute of Information Technology, Noida.', '2023-07-03', '2-week online summer school on Two Week Online Summer School on Cyber Threat Intelligence and Forensics organized by the Department of CSE &IT, Jaypee Institute of Information Technology, Noida. (July 3-15th , 2023)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Artificial Intelligence: by the people, of the people, for the people', 'NIT Kurukshetra', 'NIT Kurukshetra', '2023-10-10', 'CSE Department, NIT Kurukshetra, 10th October, 2023');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Computer Vision for Fabric Defect Detection Employing Deep Learning Models', 'NIT Kurukshetra', 'NIT Kurukshetra', '2023-08-11', 'Short Term Course on Computer Vision and Intelligent Applications (CVIA-23) during August 11-16, 2023, NIT Kurukshetra,');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Machine Learning and it’s Applications', 'NIT Hamirpur', 'NIT Hamirpur', '2023-12-11', 'e-STC on “Software Tools for Academicians and Researchers (STAR-2023)”, 11-16 December 2023, Electrical Engineering Department, NIT Hamirpur');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Multilingual Approach to imparting Education recommended by NEP-2020: Issues and Challenges,', 'Kurukshetra University', 'Kurukshetra University', '2023-10-26', 'UGC-Malavya Mission Teacher Training Centre (MM-TTC), two-week online refresher course in Information Technology from October 26, 2023, to November 8, 2023, under the theme "Bridging Horizons: Integrating IT Innovations across Disciplines."');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Deep Learning for Natural Language Processing', 'NIT Jalandhar', 'NIT Jalandhar', '2020-09-21', 'Recent advances in Data Science, Image and Natural Language Processing” (RADSINP-2020), September 21- 25, 2020)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Deep Learning Tools and Techniques for Natural Language Processing,', 'Rajiv Gandhi National Institute of Youth Development (RGNIYD), Sriperumbudur, Tamil Nadu in collaboration with the National Institute of Technology, Jalandhar (NITJ)', 'Rajiv Gandhi National Institute of Youth Development (RGNIYD), Sriperumbudur, Tamil Nadu in collaboration with the National Institute of Technology, Jalandhar (NITJ)', '2020-09-28', 'Short-term Certificate Course on Artificial Intelligence and Machine Learning held from September 28 - October 02, 2020');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Deep Learning Tools for Natural Language Processing', 'NIT Jalandhar', 'NIT Jalandhar', '2020-09-22', 'e-STC tilted "Data Analytics Tools and Techniques", 22th-26th September 2020');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Latest Machine Learning Trends in Natural Language Processing', 'NIT Hamirpur', 'NIT Hamirpur', '2020-10-12', 'e-STC on Machine Learning for Natural Language Processing 12-17, October, 2020');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Natural Language processing an AI Application', 'Manav Rachna International Institute of Research & Studies, CSE, FET, Faridabad', 'Manav Rachna International Institute of Research & Studies, CSE, FET, Faridabad', '2020-08-24', 'Online One Week STTP on AI & Machine Learning, 24th to 29th August 2020');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Recent Trends in Natural Language Processing,', 'Panipat Institute of Engineering and Technology', 'Panipat Institute of Engineering and Technology', '2020-10-20', 'October 20, 2020, Expert talk');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Anaphora Resolution: Why is it so important for NLP Application 2019', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'FDP Recent Trends in Artificial Intelligence and Mobile Systems RTAIMS- 2019');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Blockchain Technology and Artificial Intelligence 2019', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'FDP on "Blockchain Technology and its Applications" BCTA-2019');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Cloud Computing: Innovation Enabler 2019', 'NIT Jalandhar', 'NIT Jalandhar', '2023-05-01', 'TEQIP-III sponsored short-term course (STC) on “Research Trends in Cloud, Fog and Edge Computing (RTCC-2019)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Machine Learning Algorithms and Evaluation Metrics', 'NIT Jalandhar', 'NIT Jalandhar', '2019-08-09', 'TEQIP III Sponsored Short Term Course on Machine and Deep Learning in Computer Vision, August 09-13, 2019');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Video Conferencing System 2008', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'workshop on “ICT Infrastructure Awareness”');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Fundamentals of VHDL 2007', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'HDL & VLSI EDA Tools');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Introduction to VHDL 2007', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'short term course on “VLSI Design & Tools-VLSI-07”');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Algorithmic approaches for VLSI design 2006', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'Short term course on VLSI design');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Personality assessment 2006', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'workshop on personal and professional roles for women');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('33007428-2ecd-5b52-93aa-b6849142c098', 'Security issues in wireless network 2006', 'NIT Hamirpur', 'NIT Hamirpur', '2023-05-01', 'Short term course on Mobile computing');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Adapting generic network algorithms to MANETs', 'DoCSE, NIT Hamirpur', 'DoCSE, NIT Hamirpur', '2023-05-01', 'TEQIP sponsored winter school on Mobile and distributed systems MDS-13');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Algorithm Analysis', 'Shiva Institute of Technology, Bilaspur, Himachal Pradesh', 'Shiva Institute of Technology, Bilaspur, Himachal Pradesh', '2023-05-01', 'Special Lecture Series for B.Tech Students');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Introduction to Cognitive Radio Network Based Internet of Things for Cloud Computing', 'Online, Organized by DRIEMS Autonomous Engineering College, Tangi, Cuttak, Odisha', 'Online, Organized by DRIEMS Autonomous Engineering College, Tangi, Cuttak, Odisha', '2021-06-09', 'AICTE-ISTE sponsored 6 days FDP on "Recent Trends in Cloud Computing (Phase-III)"');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Network Algorithms', 'DoCSE, NIT Hamirpur', 'DoCSE, NIT Hamirpur', '2023-05-01', 'AICTE sponsored Short term course on Internet Technologies');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Overview of Cognitive Radio Based IEEE 802.22Wireless Regional Area Networks : Issues in Channel Assignment', 'Department of Computer Engineering, NIT Kurukshetra', 'Department of Computer Engineering, NIT Kurukshetra', '2023-05-01', 'Delivered lecture in a One week workshop on Next Generation Computing (NGC16)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Routing Algorithms', 'DoCSE, NIT Hamirpur', 'DoCSE, NIT Hamirpur', '2023-05-01', 'Community Development Program on Network Fundamentals');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Writing a Research Paper in LaTeX', 'DoEE, NIT Hamirpur', 'DoEE, NIT Hamirpur', '2023-05-01', 'Short term course on Software Tools for Academicians and Researchers (STAR)');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Artificial Intelligence in Education', 'Government Polytechnic Hamirpur, Himachal Pradesh', 'Government Polytechnic Hamirpur, Himachal Pradesh', '2023-05-01', 'ATAL FDP on Advancement in AI: Trends, Tools and Techniques on 07th August 2024');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'ICT enabled Teaching & Learning', 'Indira Gandhi National Tribal University (IGNTU), Amarkantak, Madhya Pradesh', 'Indira Gandhi National Tribal University (IGNTU), Amarkantak, Madhya Pradesh', '2023-05-01', 'Faculty Induction Programme (Guru Dakshata),” organized by the Malaviya Mission Teacher Training Centre (MMTTC) on 21st November 2024.');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('7f377458-de96-52a7-b8cf-04e50369469a', 'Introduction to Internet of Things (Sensor & Wireless Sensor Networks)', 'SD Bansal College of Technology, Indore, Madhya Pradesh', 'SD Bansal College of Technology, Indore, Madhya Pradesh', '2023-05-01', 'ONE WEEK (Offline) ATAL FDP on “Next Generation Robotics Enabled by IoT for Sustainable Development” on 09th September 2024');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'AI and its Applications in Architecture', 'Department of Architecture, NIT Hamirpur', 'Department of Architecture, NIT Hamirpur', '2024-10-13', 'e-STC on Information Science for Building Design and Urban Planning');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'Advancements in Explainable Generative Adversarial Networks', 'The LNMIIT Jaipur', 'The LNMIIT Jaipur', '2025-03-10', 'e-Workshop on Generative AI');
INSERT INTO expert_talks (faculty_id, title, host_organization, venue, talk_date, description)
VALUES ('56b955eb-618e-5dcb-ac02-f8404a61a048', 'Looking Inside the Black-box: An Explainable AI approach', 'NIT Hamirpur', 'NIT Hamirpur', '2024-04-04', 'Recent Advancements in Artificial Intelligence and Internet of Things (RAAI-2024)');

-- 10. Publications
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('041aa59a-3d28-5a72-bb01-f27d9a36c386', 'Repercussions of Using DNN Compilers on Edge GPUs for Real Time and Safety Critical Systems: A Quantitative Audit', 'JOURNAL', '10.1145/3611016', NULL, 'ACM Journal on Emerging Technologies in Computing Systems', '20', '1', 'Jan-22', 2023, 'SCI(E)', 'T', 'Shafi Omais, Mohammad Khalid Pandit, Saini Amarjeet, Ananthanarayanan Gayathri, Rijurekha Sen', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('041aa59a-3d28-5a72-bb01-f27d9a36c386', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('608cf47d-35f3-579f-b117-cc1d637269d5', 'Variance-Guided Structured Sparsity in Deep Neural Networks', 'JOURNAL', '10.1109/TAI.2022.3221688', NULL, 'IEEE Transactions on Artificial Intelligence', '4', '6', '1714-1723', 2022, 'SCI(E)', 'T', 'Mohammad Khalid Pandit, Mahroosh Banday', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('608cf47d-35f3-579f-b117-cc1d637269d5', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('95fb4aed-efae-5004-a47d-7ba7f25d1d09', 'Brain Tumor Detection via Asymmetry Quantification Across Mid Sagittal Plane', 'JOURNAL', '10.2174/2666255813999200831104047', NULL, 'Recent Advances in Computer Science and Communications (Formerly: Recent Patents on Computer Science)', '16', '2', '266-273', 2022, 'Scopus', 'T', 'Shoaib A Banday, Mohammad K Pandit', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('95fb4aed-efae-5004-a47d-7ba7f25d1d09', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('6f641618-319b-5606-99db-f05bbb991419', 'Automatic detection of COVID-19 from chest radiographs using deep learning', 'JOURNAL', '10.1016/j.radi.2020.10.018', NULL, 'Radiography, Elsevier', '27', '1-1', '483-489', 2021, 'SCI(E)', 'T', 'Mohammad Khalid Pandit, Shoaib Amin Banday, Roohie Naaz, Mohammad Ahsan Chishti', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('6f641618-319b-5606-99db-f05bbb991419', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('38406397-4eac-5f7f-90dd-a38b3ecd2d2c', 'Texture maps and chaotic maps framework for secure medical image transmission', 'JOURNAL', '10.1007/s11042-021-10564-1', NULL, 'Multimedia Tools and Applications', '80', '12', '17667-17683', 2021, 'SCI(E)', 'T', 'Shoaib Amin Banday, Mohammad Khalid Pandit', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('38406397-4eac-5f7f-90dd-a38b3ecd2d2c', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('d840aed3-b19b-5196-8c84-2ddd86f9e024', 'Learning sparse neural networks using non-convex regularization', 'JOURNAL', '10.1109/TETCI.2021.3058672', NULL, 'IEEE Transactions on Emerging Topics in Computational Intelligence', '6', '2', '287-299', 2021, 'SCI(E)', 'T', 'Mohammad Khalid Pandit, Roohie Naaz, Mohammad Ahsan Chishti', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('d840aed3-b19b-5196-8c84-2ddd86f9e024', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('ad5a2026-9ae7-557f-a1be-ee63c8df7dd1', 'SARS n-CoV2-19 detection from chest x-ray images using deep neural networks', 'JOURNAL', '10.1108/IJPCC-06-2020-0060', NULL, 'International Journal of Pervasive Computing and Communications', '16', '5', '419-427', 2020, 'Scopus', 'T', 'Mohammad Khalid Pandit, Shoaib Amin Banday', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('ad5a2026-9ae7-557f-a1be-ee63c8df7dd1', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('2306867d-0ca7-53e5-b8c4-c99c287f189a', 'Adaptive task scheduling in IoT using reinforcement learning', 'JOURNAL', '10.1108/IJICC-03-2020-0021', NULL, 'International Journal of Intelligent Computing and Cybernetics', '13', '3', '261-282', 2020, 'Scopus', 'T', 'Mohammad Khalid Pandit, Roohie Naaz Mir, Mohammad Ahsan Chishti', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('2306867d-0ca7-53e5-b8c4-c99c287f189a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('c46802f3-75a0-5799-a435-2d94b1660db2', 'Adaptive deep neural networks for the internet of things', 'JOURNAL', '10.2174/2210327910666191223124630', NULL, 'International Journal of Sensors Wireless Communications and Control', '10', '4', '570-581', 2020, 'Scopus', 'T', 'Mohammad Khalid Pandit, Roohie Naaz Mir, Mohammad Ahsan Chishti', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('c46802f3-75a0-5799-a435-2d94b1660db2', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('2f01431c-e506-522f-ac02-2cd149a9a35b', 'Achieving a reversible lower dimensionality transformation for picture archiving and communication system in healthcare', 'JOURNAL', '10.1049/el.2020.0992', NULL, 'Electronics Letters', '56', '17', '863-865', 2020, 'SCI(E)', 'T', 'Shoaib Amin Banday, Mohammad Khalid Pandit, Ab Rouf Khan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('2f01431c-e506-522f-ac02-2cd149a9a35b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('147312dd-ed35-5286-a46f-e91d18bfb6a6', 'A Survey on the Integration and Optimization of Large Language Models in Edge Computing Environments', 'CONFERENCE', '10.1109/ICCAE59995.2024.10569285', NULL, '2024 16th International Conference on Computer and Automation Engineering (ICCAE)', '', '', '168-172', 2024, 'Scopus', 'T', 'Dr. Mohit Kumar, Dr. Pardeep Singh, Dr. Mohammad Khalid Pandit', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('147312dd-ed35-5286-a46f-e91d18bfb6a6', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('16fcec54-40c7-5341-b480-b2c9d8caa106', 'Bang for the Buck: Evaluating the cost-effectiveness of Heterogeneous Edge Platforms for Neural Network Workloads', 'CONFERENCE', '10.1145/3583740.3628437', NULL, '2023 ACM/IEEE Symposium on Edge Computing', '', '', '', 2023, 'Other', 'T', 'Amarjeet Saini, Shende Omkar B, Pandit, Mohammad Khalid, Rijurekha Sen, Gayathri Ananthanarayanan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('16fcec54-40c7-5341-b480-b2c9d8caa106', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('74efccc9-f765-590b-bfbc-51012214ee48', 'Distributed iot analytics across edge, fog and cloud', 'CONFERENCE', '10.1109/ICRCICN.2018.8718738', NULL, '2018 Fourth International Conference on Research in Computational Intelligence and Communication Networks (ICRCICN)', '', '', '27-32', 2018, 'Scopus', 'T', 'Mohammad Khalid Pandit, Roohie Naaz, Mohammad Ahsan Chishti', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('74efccc9-f765-590b-bfbc-51012214ee48', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('43953db5-915a-5444-a4fe-2c6587dc12af', 'New methodology in gir systems: Improving web document searching', 'CONFERENCE', '10.1109/IC3.2013.6612191', NULL, 'Sixth International Conference on Contemporary Computing(IC3)', '', '', '208-212', 2013, 'Scopus', 'T', 'V. Vidyarthi, A. Yadav, and D. Yadav,', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('43953db5-915a-5444-a4fe-2c6587dc12af', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('9c1db53e-e0f3-558e-b4d6-8047c38817a8', 'A conceptual framework for e-learning', 'CONFERENCE', '0.1109/MITE.2013.6756336', NULL, 'IEEE International Conference in MOOC, Innovation and Technology in Education (MITE)', '', '', '209-213', 2014, 'Scopus', 'T', 'A. Rai, A. Yadav, D. Yadav, and R. Prasad', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('9c1db53e-e0f3-558e-b4d6-8047c38817a8', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('4a87f47a-4bca-518a-96be-081e240c6a43', 'Efficient Methods to Generate Inverted Indexes for IR Systems', 'CONFERENCE', '10.1007/978-81-322-2757-1_43', NULL, '3rd International Conference on Information System Design & Intelligent Applications (INDIA 2016)', '2', '', '431-440', 2016, 'Scopus', 'T', 'A. K. Yadav, D. Yadav, and D. Rai,', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('4a87f47a-4bca-518a-96be-081e240c6a43', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('bedaf203-f1a8-53a0-98f0-d0ebf228cddc', 'Online food court payment system using blockchain technolgy', 'CONFERENCE', '10.1109/UPCON.2018.8596794', NULL, '5th IEEE Uttar Pradesh Section International Conference on Electrical, Electronics and Computer Engineering (UPCON)', '', '', '1-7', 2019, 'Scopus', 'T', 'A. Yadav, D. Yadav, S. Gupta, D. Kumar, and P. Kumar', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('bedaf203-f1a8-53a0-98f0-d0ebf228cddc', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('b9c8f810-002b-5a60-88bf-6fd39ce39381', 'Age Group Prediction on Textual Data using Sentiment Analysis', 'CONFERENCE', '10.1145/3439231.3439262', NULL, '9th International Conference on Software Development and Technologies for Enhancing Accessibility and Fighting Info-exclusion', '', '', '61-65', 2021, 'Other', 'T', 'D. Yadav, A. Gupta, S. Asati, N. Choudhary, and A. K. Yadav,', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('b9c8f810-002b-5a60-88bf-6fd39ce39381', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('61944050-4bca-57a3-aeb0-2acb7cab62f2', 'Heart disease prediction using hybrid classification methods', 'CONFERENCE', '10.1007/9789811625947_46', NULL, 'International Conference on Innovative Computing and Communications', '1387', '', '565-573', 2021, 'Scopus', 'T', 'Bharadwaj, Aniket, Divakar Yadav, and Arun Kumar Yadav.', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('61944050-4bca-57a3-aeb0-2acb7cab62f2', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('97c4847c-4d3f-5a71-b397-ec3e94941457', 'Wavelet tree ensembles with machine learning and its classification', 'CONFERENCE', '10.1088/1742-6596/1998/1/012001', NULL, '3rd International Conference on Smart and Intelligent Learning for Information Optimization (CONSILIO 2021)', '1998', '', '12001', 2021, 'Scopus', 'T', 'N. Katiyar, S. Gupta, A. K. Yadav, and D. Yadav,', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('97c4847c-4d3f-5a71-b397-ec3e94941457', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('cdad0392-1ca2-5af1-8851-3f18bcc4f17c', 'Retinal Blood Vessel Segmentation using Convolutional Neural Networks', 'CONFERENCE', 'https://www.scitepress.org/Papers/2021/107195/107195.pdf', NULL, 'In Proceedings of the 13th International Joint Conference on Knowledge Discovery, Knowledge Engineering and Knowledge Management (IC3K 2021)', '', '', '292-298', 2021, 'Scopus', 'T', 'Yadav, Arun Kumar, Arti Jain, Jorge Luis Morato, and Divakar Yadav.', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('cdad0392-1ca2-5af1-8851-3f18bcc4f17c', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('32aa4e67-f72e-5f11-af67-aabd83f66550', 'Index Optimization using Wavelet tree and Compression', 'CONFERENCE', '10.1007/9789811662898_66', NULL, 'International Conference on Data Analysis and Management-2021(ICDAM-2021)', '90', '', '809-821', 2022, 'Scopus', 'T', 'Sonam Gupta, Neha Katiyar, Arun Kumar Yadav Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('32aa4e67-f72e-5f11-af67-aabd83f66550', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('0bf7088c-181d-5c0d-965c-86b3da956db7', 'Optimization of Textual Index Construction Using Compressed Parallel Wavelet Tre', 'CONFERENCE', '0.1007/978-981-19-0604-6_43', NULL, 'International Conference on Computing and Communica- tion Networks', '394', '', '457-466', 2022, 'Scopus', 'T', 'Yadav, Arun Kumar, Sonam Gupta, Divakar Yadav, and Bharti Shukla', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('0bf7088c-181d-5c0d-965c-86b3da956db7', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('3382f362-e2cc-5b36-8682-39ff7bad1ba1', 'Text Summarization of Legal Documents Using Reinforcement Learning: A Study.', 'CONFERENCE', '10.1007/978-981-19-2894-9_30', NULL, '5th International Conference on Intelligent Sustainable Systems (ICISS 2022)', '458', '', '403-414', 2022, 'Scopus', 'T', 'Shukla, Bharti, Sonam Gupta, Arun Kumar Yadav, and Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('3382f362-e2cc-5b36-8682-39ff7bad1ba1', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('6da85ab4-cc7b-546e-a2f6-450c3aa34d10', 'Challenges and Issues in Legal Documents Classification', 'CONFERENCE', '10.1063/5.0161060', NULL, 'International Conference on Innovative Computing, Informatics and Advanced Communication Systems (ICICIAC-2022)', '2754', '', '', 2023, 'Scopus', 'T', 'Sonam Gupta, Arun Kumar Yadav, Divakar Yadav and Bharti Shukla,', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('6da85ab4-cc7b-546e-a2f6-450c3aa34d10', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('deefff03-cbeb-5276-b45b-14f06a536067', 'Extractive Text Summarization using Statistical Approach', 'CONFERENCE', '10.1007/978-981-19-7867-8_52', NULL, 'International Conference on Computer Vision and Machine Intelligence (CVMI)', '586', '', '655-667', 2023, 'Scopus', 'T', 'Kartikey Tiwali, Arun Kumar Yadav, Mohit Kumar Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('deefff03-cbeb-5276-b45b-14f06a536067', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('d0698f7a-625e-576f-b3b5-aef7c3b0b5dd', 'Bird Species Classification from images using Deep Learning', 'CONFERENCE', '0.1007/978-3-031-31417-9_30', NULL, '7th International Conference on Computer Vision Image Processing (CVIP-2022)', '1777', '', '388-401', 2023, 'Scopus', 'T', 'Manoj Kumar, Arun Kumar Yadav, Mohit Kumar Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('d0698f7a-625e-576f-b3b5-aef7c3b0b5dd', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('57c4264d-75d1-5be7-b439-357f05d4492d', 'Analysis of Automatic Text Classification of Legal Documents', 'CONFERENCE', 'https://ssrn.com/abstract=4288439', NULL, 'International Conference on Computing and Communication Networks (ICCCN-2022)', '', '', '', 2022, 'Scopus', 'T', 'Sonam Gupta, Arun Kumar Yadav, Divakar Yadav and Utkarsh Dixit', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('57c4264d-75d1-5be7-b439-357f05d4492d', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('a9682550-aefe-59b7-9493-7758cb917ad8', 'Human Activity Recognition in Videos using Deep Learning', 'CONFERENCE', '10.1007/978-3-031-27609-5_23', NULL, '4th International Conference on Soft Computing and its Engineering Applications (icSoftComp2022)', '1788', '', '288-299', 2022, 'Scopus', 'T', 'Mohit Kumar, Adarsh Rana, Ankita, Arun Kumar Yadav, Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('a9682550-aefe-59b7-9493-7758cb917ad8', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('1f656e15-fa3e-5c99-9bfd-300452d50b0b', 'Video Anomaly Detection for Pedestrian Surveillance', 'CONFERENCE', '10.1007/978-981-19-7867-8_39', NULL, 'International Conference on Computer Vision and Machine Intelligence (CVMI)', '586', '', '489-500', 2023, 'Scopus', 'T', 'Divakar Yadav , Arti Jain , Saumya Asati and Arun Kumar Yadav,', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('1f656e15-fa3e-5c99-9bfd-300452d50b0b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('23a48370-5ac8-5794-9a3a-eabe90ea17ce', 'Recent Advances in DL-based Text Summariza- tion: A Systematic Review”', 'CONFERENCE', '10.1109/ICACITE57410.2023.10183122', NULL, '3rd International Conference on Advance Computing and Innovative Technologies in Engineering (ICACITE)', '', '', '391-397', 2023, 'Scopus', 'T', 'Sonam Gupta, Arun Kumar Yadav, Divakar Yadav and Utkarsh Dixit', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('23a48370-5ac8-5794-9a3a-eabe90ea17ce', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('58c1df26-d7c3-5d34-9e67-8a016c86746e', 'wavelet Tree Compression in Legal Documents', 'CONFERENCE', '10.1007/978-981-99-3716-5_25', NULL, '4th DOCTORAL SYMPOSIUM ON COMPUTATIONAL INTELLIGENCE (DOSCI 2023)', '726', '', '291-206', 2023, 'Scopus', 'T', 'Utkarsh Dixit, Sonam Gupta, Arun Kumar Yadav, Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('58c1df26-d7c3-5d34-9e67-8a016c86746e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('87bede1c-f3b9-5990-89dd-6f13bd6374a3', 'Enhancing Legal Document Understanding through Text Summarization: A Study on NLP and Wavelet Tree Techniques', 'CONFERENCE', '10.1007/978-981-97-3594-5_10', NULL, '2nd International Conference on Cyber Intelligence and Information Retrieval (CIIR 2023)', '1', '1', '115-126', 2024, 'Scopus', 'T', 'Utkarsh Dixit, Sonam Gupta, Arun Kumar Yadav, Divakar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('87bede1c-f3b9-5990-89dd-6f13bd6374a3', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('0780c0a9-71ef-5bde-ae98-b0c30e2a2efe', 'TheEvolutionofRFIDSecurityandPrivacy:AResearchSury', 'CONFERENCE', '10.1109/CSNT.2011.31', NULL, 'International conference on communication systems and network technologies, Katra- Jammu (India)', '', '', '115-119', 2011, 'Scopus', 'T', 'R.K. PATERIA, SANGEETA SHARMA', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('0780c0a9-71ef-5bde-ae98-b0c30e2a2efe', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('863ffcb7-ce2b-5c9a-b98d-dde3e56e9ea8', 'A technical review for efficient virtual machine migration', 'CONFERENCE', '10.1109/CUBE.2013.14', NULL, 'International conference on cloud & Ubiquitous computing & emerging technologies, Pune (India)', '', '', '20-25', 2013, 'Scopus', 'T', 'SANGEETA SHARMA, MEENU CHAWLA', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('863ffcb7-ce2b-5c9a-b98d-dde3e56e9ea8', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('46e9786c-8f07-55b8-bda5-b03db682fb46', 'A lossless compression algorithm based on high frequency intensity removal for grayscale images', 'CONFERENCE', '10.1007/978-3-030-96040-7_61', NULL, 'International Conference on Advanced Network Technologies and Intelligent Computing', '1534', '', '818-831', 2021, 'Scopus', 'T', 'Sangeeta Sharma, Nishant Singh Hada, Gaurav Choudhary, Syed Mohd Kashif', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('46e9786c-8f07-55b8-bda5-b03db682fb46', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('2250eae9-0fe4-5d22-bdf7-a920c0c45c66', 'Minimizing Cold Start Times in Serverless Deployments', 'CONFERENCE', '10.1145/3549206.3549234', NULL, 'Proceedings of the 2022 Fourteenth International Conference on Contemporary Computing', '', '', '156-161', 2022, 'Scopus', 'T', 'Daniyaal Khan, Basant Subba, Sangeeta Sharma', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('2250eae9-0fe4-5d22-bdf7-a920c0c45c66', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('beee7abf-d189-51ca-8cfc-8c58bfd999a3', 'A novel recommendation system for vaccines using hybrid machine learning model', 'CONFERENCE', '10.1007/978-981-99-0085-5_35', NULL, 'Machine Intelligence Techniques for Data Analysis and Signal Processing: Proceedings of the 4th International Conference MISP', '1', '', '433-442', 2023, 'Scopus', 'T', 'Nishant Singh Hada, Sreenu Maloth, Chandrashekar Jatoth, Ugo Fiore, Sangeeta Sharma, Subrahmanyam Chatharasupalli, Rajkumar Buyya', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('beee7abf-d189-51ca-8cfc-8c58bfd999a3', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('4e4cfc5a-3258-5313-b1cb-449eb97af2fb', 'Automation of FaaS Serverless Frameworks OpenFaaS and OpenWhisk in Private Cloud', 'CONFERENCE', '10.1109/WCONF58270.2023.10235008', NULL, 'World Conference on Communication & Computing (WCONF)', '', '', '', 2023, 'Scopus', 'T', 'Sangeeta Sharma Pankaj Tiwari', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('4e4cfc5a-3258-5313-b1cb-449eb97af2fb', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('4127e130-de29-5dd5-a0e1-f91aaadc77b8', 'Image Encryption Algorithm Based on Timeout, Pixel Transposition and Modified Fisher-Yates Shuffling', 'CONFERENCE', '10.1007/978-3-031-23095-0_2', NULL, 'International Conference on Advancements in Smart Computing and Information Security', '1760', '', '24-43', 2023, 'Scopus', 'T', 'Sangeeta Sharma, Syed Mohd Kashif Ankush Kumar, Nishant singh Hada, Gaurav Choudhary', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('4127e130-de29-5dd5-a0e1-f91aaadc77b8', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('69d37708-c66f-57cf-bdda-4783bf8e150a', 'A three phase optimization method for precopy based vm live migration, vol. 5, no. 1', 'JOURNAL', '10.1186/s40064-016-2642-2', NULL, 'Springer Plus', '5', '', '1--24', 2016, 'Scopus', 'T', 'SANGEETA SHARMA, MEENU CHAWLA', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('69d37708-c66f-57cf-bdda-4783bf8e150a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('3b7a574c-b2ee-5ec5-8d29-3330753537e3', 'Distributed Denial-of-Service Attack Detection and Mitigation Using Feature Selection and Intensive Care Request Processing, Volume 43, No. 2', 'JOURNAL', '10.1007/s13369-017-2844-0', NULL, 'Arabian Journal for Science and Engineering', '43', '', '959-967', 2017, 'SCI(E)', 'T', 'NITESH BHAROT, PRIYANKA VERMA, SANGEETA SHARMA, AND VEENADHARI SURAPARAJU', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('3b7a574c-b2ee-5ec5-8d29-3330753537e3', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('8820c112-b2e7-5b98-a6f0-033997b0d6bc', 'Eye Disease Detection Through Image Classification Using Federated Learning', 'JOURNAL', '10.1007/s42979-023-02211-3', NULL, 'SN Computer Science Springer', '4', '6', '836', 2023, 'Scopus', 'T', 'Vishal Kaushal, Nishant Singh Hada, Sangeeta Sharma', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('8820c112-b2e7-5b98-a6f0-033997b0d6bc', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('83cda2e0-23ff-56b5-910b-111dacc04f52', 'Logging based coordinated check pointing in mobile distributed computing systems', 'JOURNAL', '10.1080/03772063.2005.11416429', NULL, 'ACCST Journal of research', '51', '6', '485-490', 2005, 'Scopus', 'T', 'Lalit Kumar, Parveen Kumar, RK Chauhan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('83cda2e0-23ff-56b5-910b-111dacc04f52', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('d1d6969e-e068-59b1-8bf9-0a46e00b9158', 'A hybrid coordinated checkpointing protocol for mobile computing systems', 'JOURNAL', '10.1080/03772063.2006.11416461', NULL, 'IETE journal of research', '52', '2', '247-254', 2006, 'SCI(E)', 'T', 'Parveen Kumar, Lalit Kumar, RK Chauhan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('d1d6969e-e068-59b1-8bf9-0a46e00b9158', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('ba1c13ef-f5a2-524c-a413-330832481d6b', 'A synchronous checkpointing protocol for mobile distributed systems: probabilistic approach', 'JOURNAL', '10.1504/IJICS.2007.013957', NULL, 'International Journal of Information and Computer Security', '3', '3', '298-314', 2007, 'ESCI', 'T', 'Lalit Kumar Awasthi, Prashant Kumar', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('ba1c13ef-f5a2-524c-a413-330832481d6b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('5a7c51e1-f580-57b7-b583-b956d7952e17', 'A weighted checkpointing protocol for mobile distributed systems.', 'JOURNAL', '10.1504/IJAHUC.2010.032227', NULL, 'International Journal of Ad Hoc and Ubiquitous Computing', '5', '3', '137-149', 2010, 'Scopus', 'T', 'Lalit K. Awasthi, Manoj Misra R.C. Joshi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('5a7c51e1-f580-57b7-b583-b956d7952e17', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('90497dd8-431f-5a81-b83c-4f1913c7fb5d', 'PArch: a cross-organisational peer-to-peer framework supporting the aggregation and exchange of storage for efficient e-mail archival', 'JOURNAL', '10.1504/IJBIS.2010.029482', NULL, 'International Journal of Business Information Systems', '5', '1', '102-110', 2010, 'Scopus', 'T', 'Ankur Gupta, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('90497dd8-431f-5a81-b83c-4f1913c7fb5d', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('721fbab8-2509-54b6-ab53-dc7fac54bf58', 'Toward a Quality-of-Service Framework for Peer-to-Peer Applications.', 'JOURNAL', '10.4018/jdst.2010070101', NULL, 'International Journal Distributed Syst. Technol.', '1', '3', '', 2010, 'Scopus', 'T', 'Ankur Gupta, Lalit K. Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('721fbab8-2509-54b6-ab53-dc7fac54bf58', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('c16fc69d-4162-504f-807b-f5aa6c4b9805', 'IndNet: towards a peer-to-peer community network that connects the information technology industry and academia in India.', 'JOURNAL', '10.1504/IJNVO.2010.029871', NULL, 'International Journal of Networking and Virtual Organisations', '19', '3', '63-79', 2010, 'Scopus', 'T', 'Ankur Gupta, Lalit K. Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('c16fc69d-4162-504f-807b-f5aa6c4b9805', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('7355f94a-aa37-58ab-8fa1-ac3852cc4e5e', 'A containment-based security model for cycle-stealing P2P applications', 'JOURNAL', '10.1080/19393551003762207', NULL, 'Information Security Journal: A Global Perspective', '36', '4', '191-203', 2010, 'Scopus', 'T', 'Ankur Gupta, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('7355f94a-aa37-58ab-8fa1-ac3852cc4e5e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('1042edf4-cc18-556f-8c42-57557c171b9f', 'Cooperative Caching in Mobile Ad Hoc Networks', 'JOURNAL', '10.4018/jmcmc.2011070102', NULL, 'International Journal of Mobile Computing and Multimedia Communications (IJMCMC)', '3', '1', '', 2011, 'Scopus', 'T', 'Naveen Chauhan, Lalit K Awasthi, Narottam Chand, Ramesh Chandra Joshi, Manoj Misra', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('1042edf4-cc18-556f-8c42-57557c171b9f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('1b61dce2-e874-5f67-b998-93017ea4421a', 'A Distributed Weighted Cluster Based Routing Protocol for MANETs', 'JOURNAL', '10.4236/wsn.2011.32006', NULL, 'Wireless Sensor Network', '3', '2', '54-60', 2011, 'Scopus', 'T', 'Naveen Chauhan, Lalit Kumar Awasthi, Narottam Chand, Vivek Katiyar, Ankit Chugh', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('1b61dce2-e874-5f67-b998-93017ea4421a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('cf5358bb-e3c3-55fb-b87a-b6adaf988f42', 'Peers-for-peers (P4P): an efficient and reliable fault-tolerance strategy for cycle-stealing P2P applications', 'JOURNAL', '10.1504/IJCNDS.2011.038525', NULL, 'International Journal of Communication Networks and Distributed Systems', '6', '2', '202-228', 2011, 'Scopus', 'T', 'Ankur Gupta, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('cf5358bb-e3c3-55fb-b87a-b6adaf988f42', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('797fa728-5036-515e-91d1-223157d5002e', 'Performance tradeoff with routing protocols for radio models in wireless sensor networks', 'JOURNAL', '10.4236/wet.2011.22008', NULL, 'Wireless Engineering and Technology', '2', '2', '53-59', 2011, 'Scopus', 'T', 'Manju Bala, Lalit Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('797fa728-5036-515e-91d1-223157d5002e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('02741521-efcf-5853-bdb6-09e71916f31f', 'Robust data security for cloud while using third party auditor', 'JOURNAL', 'https://dx.doi.rog/surl.li/niltc', NULL, 'International journal of advanced research in computer science and software engineering', '3', '', '', 2012, 'Scopus', 'T', 'Abhishek Mohta, Ravi Kant Sahu, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('02741521-efcf-5853-bdb6-09e71916f31f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('56ff0810-a0a6-523b-a6b4-179eee20ba66', 'Proficient D-SEP protocol with heterogeneity for maximizing the lifetime of wireless sensor networks', 'JOURNAL', '10.5815/ijisa.2012.07.01.07', NULL, 'International Journal of Intelligent systems and applications', '25', '7', '1341-1354', 2012, 'Scopus', 'T', 'Manju Bala, Lalit Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('56ff0810-a0a6-523b-a6b4-179eee20ba66', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('21548da6-9e62-59c2-93fe-71c258a632a0', 'A log-based recovery protocol for mobile distributed computing systems', 'JOURNAL', '10.1166/jbic.2013.1021', NULL, 'Journal of Bioinformatics and Intelligent Control', '1', '2', '138-147', 2012, 'Scopus', 'T', 'Rajesh Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('21548da6-9e62-59c2-93fe-71c258a632a0', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('3956fa0f-d582-59df-939b-595f50b6a49e', 'An efficient coordinated checkpointing approach for distributed computing systems with reliable channels', 'JOURNAL', '10.2316/Journal.202.2012.1.202-2118', NULL, 'ACTA: International Journal of Computers and Applications', '34', '1', '', 2012, 'Scopus', 'T', 'Lalit K Awasthi, Manoj Misra, Ramesh C Joshi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('3956fa0f-d582-59df-939b-595f50b6a49e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('7a039e9f-8c68-574d-8268-8cc003e3d62e', 'Integrated Push Pull Algorithm with Accomplishment Assurance in VANETs', 'JOURNAL', 'https://dx.doi.porg/10.47164/ijngc.v14i3.1299', NULL, 'International Journal. Next Gener. Comput.', '3', '3', '', 2012, 'Scopus', 'T', 'Ajay Guleria, Narottam Chand Kaushal, Lalit Kumar Awasthi:', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('7a039e9f-8c68-574d-8268-8cc003e3d62e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('587195e4-f6ec-50be-a7f0-4402a6bdbf1a', 'Adaptive Time Synchronization for Homogeneous WSNs', 'JOURNAL', 'hrcak.srce.hr/file/114170', NULL, 'International Journal of Engineering Business Management', '14', '4', '', 2012, 'Scopus', 'T', 'Siddhartha Chauhan, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('587195e4-f6ec-50be-a7f0-4402a6bdbf1a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('2f574b2b-e84d-52ab-944c-8016043d3a5f', 'Cache replacement in mobile adhoc networks', 'JOURNAL', '10.4018/jdst.2012040102', NULL, 'International Journal of Distributed Systems and Technologies (IJDST)', '2', '2', '22-38', 2012, 'Scopus', 'T', 'Naveen Chauhan, Lalit K Awasthi, Narottam Chand', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('2f574b2b-e84d-52ab-944c-8016043d3a5f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('d303d201-c87a-592c-af38-4974da661d7f', 'An energy efficient cycle stealing algorithm for best effort services in wireless sensor networks.', 'JOURNAL', '10.1504/IJCNDS.2014.060624', NULL, 'International Journal of Communication Networks and Distributed Systems', '45', '3', '75-96', 2013, 'Scopus', 'T', 'Siddhartha Chauhan, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('d303d201-c87a-592c-af38-4974da661d7f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('0835e139-5f00-50ef-b42c-f55c49433478', 'Peer enterprises: design and implementation of a cross-organisational peer-to-peer framework', 'JOURNAL', '10.1504/IJCNDS.2013.057716', NULL, 'International Journal of Communication Networks and Distributed Systems', '', '4', '347-375', 2013, 'Scopus', 'T', 'Ankur Gupta, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('0835e139-5f00-50ef-b42c-f55c49433478', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('54de4036-5431-5112-aa0e-de38d83c1db9', 'Cooperative Cache Replacement Policy for MANETs', 'JOURNAL', '10.4018/ijapuc.2014040103', NULL, 'International Journal of Advanced Pervasive and Ubiquitous Computing (IJAPUC)', '11', '2', '15-26', 2014, 'Scopus', 'T', 'Prashant Kumar, Naveen Chauhan, LK Awasthi, Narottam Chand', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('54de4036-5431-5112-aa0e-de38d83c1db9', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('1d950a0e-d43e-5a13-a9c2-b6f5c5da5f92', 'Minimum mutable checkpoint-based coordinated checkpointing protocol for mobile distributed systems.', 'JOURNAL', '10.1504/IJCNDS.2014.062226', NULL, 'International Journal of Communication Networks and Distributed Systems', '6', '4', '356-380', 2014, 'Scopus', 'T', 'Lalit K. Awasthi, Manoj Misra, R.C. Joshi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('1d950a0e-d43e-5a13-a9c2-b6f5c5da5f92', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('9120d8bb-53fd-52df-9daa-be400119ed34', 'Analyzing and reducing impact of dynamic obstacles in vehicular ad-hoc networks', 'JOURNAL', '10.1007/s11276-014-0869-9', NULL, 'Wireless Networks', '12', '', '15-26', 2015, 'SCI(E)', 'T', 'Brij Bihari Dubey, Naveen Chauhan, Narottam Chand, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('9120d8bb-53fd-52df-9daa-be400119ed34', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('da88eb95-ec32-5312-b55b-39c146866ef9', 'Checkpointing and Roll back Recovery Protocols in Wireless Ad hoc Networks: A Review', 'JOURNAL', '10.47164/ijngc.v6i2.81', NULL, 'International Journal of Next-Generation Computing', '21', '1', '140-152', 2015, 'Scopus', 'T', 'Jawahar Thakur, Dr Arvind Kalia, & Dr. Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('da88eb95-ec32-5312-b55b-39c146866ef9', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('14bb7e22-2de0-58ff-99f2-cc86a2a1b671', 'Priority based efficient data scheduling technique for VANETs', 'JOURNAL', '10.1007/s11276-015-1051-8', NULL, 'Wireless Networks', '22', '5', '1641-1657', 2016, 'Scopus', 'T', 'Prof. Lalit Kumar Awasthi, Dr. Richa', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('14bb7e22-2de0-58ff-99f2-cc86a2a1b671', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('8e3e64ac-91ff-5d01-970a-2ae10bd0f978', 'A critical survey of live virtual machine migration techniques', 'JOURNAL', '10.1186/s13677-017-0092-1', NULL, 'Journal of Cloud Computing', '6', '1', '1', 2017, 'Scopus', 'T', 'Anita Choudhary, Mahesh Chandra Govil, Girdhari Singh, Lalit K Awasthi, Emmanuel S Pilli, Divya Kapil', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('8e3e64ac-91ff-5d01-970a-2ae10bd0f978', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('601b392c-cd74-5093-a374-3c547cd00c71', 'Empirical analysis of attack graphs for mitigating critical paths and vulnerabilities', 'JOURNAL', '10.1016/j.cose.2018.04.006', NULL, 'Computers & Security', '77', '', '359-10', 2018, 'Scopus', 'T', 'Urvashi Garg, Geeta Sikka, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('601b392c-cd74-5093-a374-3c547cd00c71', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('47703d8c-a44a-5fb3-b08a-e56fe9b94eb6', 'Laman: A supervisor controller based scalable framework for software defined networks', 'JOURNAL', '10.1016/j.comnet.2019.05.003', NULL, 'Computer Networks', '15', '', '134-10', 2019, 'Scopus', 'T', 'Amit Nayyer, Aman Kumar Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('47703d8c-a44a-5fb3-b08a-e56fe9b94eb6', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('38d9fa23-ee81-595f-b80a-6205d8c52d37', 'Tunicate Swarm Algorithm: A new bio-inspired based metaheuristic paradigm for global optimization', 'JOURNAL', '10.1016/j.engappai.2020.103541', NULL, 'Engineering Applications of Artificial Intelligence', '90', '', '', 2020, 'Scopus', 'T', 'Satnam Kaur, Lalit K Awasthi, AL Sangal, Gaurav Dhiman', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('38d9fa23-ee81-595f-b80a-6205d8c52d37', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('8c91acdb-25c0-5909-902a-c6efb25da46f', 'HMOSHSSA: a hybrid meta-heuristic approach for solving constrained optimization problems', 'JOURNAL', '10.1007/s00366-020-00989-x', NULL, 'Engineering with Computers', '37', '40', '3167-3203', 2020, 'Scopus', 'T', 'Satnam Kaur, Lalit K Awasthi, AL Sangal', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('8c91acdb-25c0-5909-902a-c6efb25da46f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('0939f3a2-1798-57cb-ab55-c761f687b826', 'Enhancing web service clustering using Length Feature Weight Method for service description document vector space representation', 'JOURNAL', '10.1016/j.eswa.2020.113682', NULL, 'Expert Systems with Applications', '161', '', '', 2020, 'Scopus', 'T', 'Neha Agarwal, Geeta Sikka, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('0939f3a2-1798-57cb-ab55-c761f687b826', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('a4c7ed5e-281e-531a-b89b-3ac23a1d2dc2', 'Evaluation of web service clustering using Dirichlet Multinomial Mixture model-based approach for Dimensionality Reduction in service representation', 'JOURNAL', '10.1016/j.ipm.2020.102238', NULL, 'Information Processing & Management', '57', '4', '', 2020, 'Scopus', 'T', 'Neha Agarwal, Geeta Sikka, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('a4c7ed5e-281e-531a-b89b-3ac23a1d2dc2', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('5e949b9d-e742-5b1e-b5ef-d98672628863', 'AdPS: Adaptive Priority Scheduling for Data Services in Heterogeneous Vehicular Networks', 'JOURNAL', '10.1016/j.comcom.2020.05.013', NULL, 'Computer Communications', '', '', '71-82', 2020, 'Scopus', 'T', 'Abhilasha Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('5e949b9d-e742-5b1e-b5ef-d98672628863', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('2acd58f8-7533-536a-a06a-1ea6bf2c193b', 'Game Theory-based Routing for Software-Defined Networks', 'JOURNAL', '10.22214/ijraset.2020.32676', NULL, 'IJRASET, XII (8) (2020)', '159', '12', '', 2020, 'Scopus', 'T', 'Amit Nayyer, Aman Kumar Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('2acd58f8-7533-536a-a06a-1ea6bf2c193b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('ccd76573-becd-5c7e-a31a-130a2b8cb96b', 'An efficient cluster head election based on optimized genetic algorithm for movable sinks in IoT enabled HWSNs', 'JOURNAL', '10.1016/j.asoc.2021.107318', NULL, 'Applied Soft Computing', '107', '', '', 2021, 'Scopus', 'T', 'Aridaman Singh Nandan, Samayveer Singh, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('ccd76573-becd-5c7e-a31a-130a2b8cb96b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('8aa9b95c-03f1-5e50-a560-6440ca5e6d5c', 'A GA-Based Sustainable and Secure Green Data Communication Method Using IoT-Enabled WSN in Healthcare', 'JOURNAL', '10.1109/JIOT.2021.3108875', NULL, 'Internet of Things Journal', '9', '1', '7481-7490', 2021, 'Scopus', 'T', 'Samayveer Singh, Aridaman Singh Nandan, Aruna Malik, Rajeev Kumar, Lalit K Awasthi, Neeraj Kumar', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('8aa9b95c-03f1-5e50-a560-6440ca5e6d5c', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('f5db1d65-e7c2-5885-b79c-4d9c9a462068', 'Learning-based hybrid routing for scalability in software defined networks', 'JOURNAL', '10.1016/j.comnet.2021.108362', NULL, 'Computer Networks', '198', '', '252-267', 2021, 'Scopus', 'T', 'Amit Nayyer, Aman Kumar Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('f5db1d65-e7c2-5885-b79c-4d9c9a462068', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('6e694ac8-9df2-5931-aecf-c16c7e353766', 'Clustering based opportunistic traffic offloading technique for device-to-device communication', 'JOURNAL', '10.1007/s13198-021-01136-5', NULL, 'International Journal of System Assurance Engineering and Management', '185', '', '0976-4348', 2021, 'ESCI', 'T', 'Prashant Kumar, Naveen Chauhan, Mohit Kumar, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('6e694ac8-9df2-5931-aecf-c16c7e353766', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('eeb27591-2cfc-5add-87c0-efb6011255eb', 'An ensemble approach for optimization of penetration layout in wide area networks', 'JOURNAL', '10.1016/j.comcom.2021.04.009', NULL, 'Computer Communications', '174', '', '61-74', 2021, 'Scopus', 'T', 'Urvashi Garg, Geeta Sikka, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('eeb27591-2cfc-5add-87c0-efb6011255eb', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('46bfe832-b4f2-5e41-9749-8774fb19c391', 'Empirical risk assessment of attack graphs using time to compromise framework', 'JOURNAL', '10.1504/IJICS.2021.117393', NULL, 'International Journal of Information and Computer Security', '16', '1', '192-206', 2021, 'Scopus', 'T', 'Urvashi Garg, Geeta Sikka, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('46bfe832-b4f2-5e41-9749-8774fb19c391', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('5900d229-20a4-593d-92ed-172b0ca78fea', 'Unified model towards Scalability in Software Defined Networks', 'JOURNAL', '10.47164/ijngc.v14i3.1299', NULL, 'International Journal Next Gener. Comput', '12', '1', '', 2021, 'Scopus', 'T', 'Amit Nayyer, Aman Kumar Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('5900d229-20a4-593d-92ed-172b0ca78fea', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('f0b67144-12a2-59ff-973c-338e0cb1f5fc', 'A Review on Software Refactoring Opportunity Identification and Sequencing in Object-oriented Software', 'JOURNAL', '10.2174/2352096513999200704140718', NULL, 'Recent Advances in Electrical & Electronic Engineering (Formerly Recent Patents on Electrical & Electronic Engineering)', '14', '3', '252-267', 2021, 'Scopus', 'T', 'Satnam Kaur, Lalit K Awasthi, Amrit L Sangal', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('f0b67144-12a2-59ff-973c-338e0cb1f5fc', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('5b2fefc9-678e-537f-b101-1f1812bae3af', 'Priority based data gathering using multiple mobile sinks in cluster based UWSNs for oil pipeline leakage detection', 'JOURNAL', '10.1002/wcm.654', NULL, 'Springer: Cluster Computing', '25', '8', '1341-1354', 2022, 'Scopus', 'T', 'Nitin Goyal, Ashok Kumar, Renu Popli, Lalit Kumar Awasthi, Nonita Sharma, Gaurav Sharma', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('5b2fefc9-678e-537f-b101-1f1812bae3af', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('6fe01bab-799b-56cf-af98-12dad4e8ce5f', 'A range-based node localization scheme with hybrid optimization for underwater wireless sensor network', 'JOURNAL', '10.1002/dac.5147', NULL, 'International Journal of Communication Systems', '35', '2', '', 2022, 'Scopus', 'T', 'Mamta Nain, Nitin Goyal, Lalit Kumar Awasthi, Amita Malik', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('6fe01bab-799b-56cf-af98-12dad4e8ce5f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('e38a707e-b497-5ad9-b11e-7ed50a057035', 'Buffer-loss estimation to address congestion in 6LoWPAN based resource-restricted ‘Internet of Healthcare Things’ network', 'JOURNAL', '10.1016/j.comcom.2021.10.016', NULL, 'Computer Communications', '181', '', '236-256', 2022, 'SCI(E)', 'T', 'Himanshu Verma, Naveen Chauhan, Narottam Chand, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('e38a707e-b497-5ad9-b11e-7ed50a057035', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('5e40c07d-68fe-5d9e-807b-79341a947c3b', 'Secure authentication and session key management scheme for Internet of Vehicles', 'JOURNAL', '10.1002/ett.4451', NULL, 'Transactions on Emerging Telecommunications Technologies', '33', '', '', 2022, 'SCI(E)', 'T', 'Nishant Sharma, Naveen Chauhan, Narottam Chand, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('5e40c07d-68fe-5d9e-807b-79341a947c3b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('d1e38c9e-a1f7-5601-802a-b5065315b583', 'A range based node localization scheme with hybrid optimization for underwater wireless sensor network', 'JOURNAL', NULL, NULL, 'Computer Networks', '35', '2', '', 2022, 'Scopus', 'T', 'Mamta Nain, Nitin Goyal, Lalit Kumar Awasthi, Amita Malik', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('d1e38c9e-a1f7-5601-802a-b5065315b583', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('403561c8-fa85-510e-9622-47de8a010d0a', 'Human pose estimation using deep learning: review, methodologies, progress and future research directions', 'JOURNAL', '10.1007/s13735-022-00261-6', NULL, 'International Journal of Multimedia Information Retrieval', '11', '12', '489-521', 2022, 'Scopus', 'T', 'Pranjal Kumar, Siddhartha Chauhan & Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('403561c8-fa85-510e-9622-47de8a010d0a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('7a5cbba9-e872-5ec2-bb4f-712dc5cb2441', 'A statistical analysis of SAMPARK dataset for peer-to-peer traffic and selfish-peer identification', 'JOURNAL', '10.1007/s11042-022-13556-x', NULL, 'Multimedia Tools and Applications', '10', '3', '', 2022, 'SCI(E)', 'T', 'Md Ansari, Sarfaraj Alam, Kunwar Pal, Prajjval Govil, Mahesh Chandra Govil, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('7a5cbba9-e872-5ec2-bb4f-712dc5cb2441', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('8a19a8a8-fcbf-5c09-abf8-370bdd441e43', 'A systematic literature review on web service clustering approaches to enhance service discovery, selection and recommendation', 'JOURNAL', '10.1007/s10586-022-03613-3', NULL, 'Computer Science Review', '45', '', '', 2022, 'Scopus', 'T', 'Neha Agarwal, Geeta Sikka, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('8a19a8a8-fcbf-5c09-abf8-370bdd441e43', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('83f440da-0406-56b0-981e-04fad640518f', 'Energy-aware scientific workflow scheduling in cloud environment', 'JOURNAL', NULL, NULL, 'Cluster Computing', '25', '', '3845-3874', 2022, 'Scopus', 'T', 'Anita Choudhary, Mahesh Chandra Govil, Girdhari Singh, Lalit K Awasthi, Emmanuel S Pilli', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('83f440da-0406-56b0-981e-04fad640518f', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('397ce628-8627-54e6-aa5a-d9df03aee9fb', 'Ob-EID: Obstacle aware event information dissemination for SDN enabled vehicular network', 'JOURNAL', '10.1016/j.comnet.2022.109257', NULL, 'Computer Networks', '216', '', '', 2022, 'Scopus', 'T', 'Abhilasha Sharma, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('397ce628-8627-54e6-aa5a-d9df03aee9fb', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('9472fd73-35f4-5c32-93df-91fc56c401c6', 'Schema generation for document stores using workload-driven approach', 'JOURNAL', '10.1007/s11227-023-05613-5', NULL, 'The Journal of Supercomputing', '4', '', '', 2023, 'Scopus', 'T', 'Himanshu Verma, Naveen Chauhan, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('9472fd73-35f4-5c32-93df-91fc56c401c6', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('a1404300-73d5-5827-803f-bc253249a4f5', 'Human Activity Recognition (HAR) Using Deep Learning: Review, Methodologies, Progress and Future Research Directions', 'JOURNAL', '10.1007/s11831-023-09986-x', NULL, 'Archives of Computational Methods in Engineering', '3', '4', '', 2023, 'Scopus', 'T', 'Pranjal Kumar, Siddhartha Chauhan, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('a1404300-73d5-5827-803f-bc253249a4f5', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('be57796e-af96-5a64-bacc-eb5208e9f51b', 'Are NoSQL Databases Affected by Schema?', 'JOURNAL', '10.1080/03772063.2023.2237478', NULL, 'IETE Journal of Research', '3', '5', '', 2023, 'SCI(E)', 'T', 'Neha Bansal, Shelly Sachdeva, Lalit K Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('be57796e-af96-5a64-bacc-eb5208e9f51b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('f209edc7-8373-557e-8ca9-60fe8d43874d', 'A review of deep learning techniques used in agriculture', 'JOURNAL', '10.1016/j.ecoinf.2023.102217', NULL, 'Ecological Informatics', '77', '', '44562', 2023, 'Scopus', 'T', 'Ishana Attri , Lalit Kumar Awasthi , Teek Parval Sharma , Priyanka Rathee', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('f209edc7-8373-557e-8ca9-60fe8d43874d', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('eaf6d835-1365-5fd5-a344-4c6891c9e201', 'Machine learning in agriculture: a review of crop management applications', 'JOURNAL', '10.1007/s11042-023-16105-2', NULL, 'Multimedia Tools and Applications', '2', '5', '1', 2023, 'SCI(E)', 'T', 'Ishana Attri, Lalit Kumar Awasthi, Teek Parval Sharma', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('eaf6d835-1365-5fd5-a344-4c6891c9e201', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('c8e70143-0fa5-59ac-ab2e-8caa2f6bc6bf', 'Towards Metaheuristic Scheduling Techniques in Cloud and Fog: An Extensive Taxonomic Review', 'JOURNAL', '10.1016/j.eswa.2023.119625', NULL, 'ACM Computing Surveys', '3', '3', '', 2023, 'Scopus', 'T', 'Raj Mohan Singh, Lalit Kumar Awasthi, Geeta Sikka', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('c8e70143-0fa5-59ac-ab2e-8caa2f6bc6bf', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('a7baed80-a1bb-5348-b7a9-7952e6b2b1da', 'Artificial Intelligence in Healthcare: Review, Ethics, Trust Challenges & Future Research Directions', 'JOURNAL', '10.1080/03772063.2023.2205377', NULL, 'Engineering Applications of Artificial Intelligence', '120', '', '58-10', 2023, 'SCI(E)', 'T', 'Pranjal Kumar, Siddhartha Chauhan, Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('a7baed80-a1bb-5348-b7a9-7952e6b2b1da', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('00191a99-312a-5715-b1d7-083f5760c9dd', 'Probabilistic Check pointing and Recovery for Mobile Distributed Systems', 'CONFERENCE', NULL, NULL, 'International conference on Advances in computing and Communication (ADCOM-2000', '', '', '', 2000, 'Scopus', 'T', 'Lalit Kumar Awasthi, M. Misra and R.C. Joshi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('00191a99-312a-5715-b1d7-083f5760c9dd', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('d90b5b86-48db-51e4-8d89-5b8226828a09', 'Non-intrusive Recovery in Mobile Distributed Systems', 'CONFERENCE', '10.1109/ICDCSW.2005.13', NULL, 'International conference on High Performance Computing (HiPC)', '', '', '', 2000, 'Scopus', 'T', 'Parveen Kumar, Lalit Kumar Awasthi, R. K. Chauhan and A. Nayyer', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('d90b5b86-48db-51e4-8d89-5b8226828a09', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('1a484312-a899-5dc6-91cd-7c44f2d05378', 'Analysis of a Transaction System with Check pointing, Failures and Rollback', 'CONFERENCE', '10.1007/3-540-46029-2_21', NULL, 'International Conference on Modelling Techniques and Tools for Computer Performance Evaluation', '', '', '279-288', 2001, 'Other', 'T', 'Kumar, P., Kumar, L., Chauhan, R. K., & Gupta, V. K.', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('1a484312-a899-5dc6-91cd-7c44f2d05378', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('45d2cf7b-05ba-5ebf-8899-f6cd87ad936a', 'Checkpointing and Recovery for Mobile Distributed Systems: A New Approach', 'CONFERENCE', '10.1155/2008/982349', NULL, 'International Conference on Computer Applications in Electrical Engineering (CERA-2002)', '', '', '', 2002, 'Scopus', 'T', 'Kumar, L., Mishra, M., & Joshi, R. C.', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('45d2cf7b-05ba-5ebf-8899-f6cd87ad936a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('03e629ac-e56d-5384-a6ea-39a815d8dab1', 'Low overhead Optimal Check pointing for Mobile Distributed Systems', 'CONFERENCE', '10.1109/ICDE.2003.1260835', NULL, 'In Proceedings 19th International Conference on Data Engineering .', '', '', '686-688', 2004, 'Other', 'T', 'Kuldeep Singh, R. B. Patel and Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('03e629ac-e56d-5384-a6ea-39a815d8dab1', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('62969bd4-4645-5b75-b612-f1a80cac76cc', 'A Non-Intrusive Minimum Process Synchronous Checkpointing Protocol for Mobile Distributed Systems', 'CONFERENCE', NULL, NULL, 'In 2005 IEEE International Conference on Personal Wireless Communications', '', '', '491-495', 2005, 'Other', 'T', 'Lalit Awasthi, Ankur Gupta and Nimrita Koul', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('62969bd4-4645-5b75-b612-f1a80cac76cc', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('89803d05-f1b0-56ce-9a00-53af25170f34', 'Fault Tolerance, Checkpointing and Ad-Hoc Networks', 'CONFERENCE', '10.1016/j.procs.2015.07.340', NULL, 'National Conference on Innovative Applications of IT and Management for Economic Growth', '', '', '', 2005, 'Other', 'T', 'Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('89803d05-f1b0-56ce-9a00-53af25170f34', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publications (id, title, publication_type, doi, isbn, venue, volume, issue, pages, year, indexing, quartile, raw_authors, status)
VALUES ('1ae5db5f-e03f-500d-b158-5f3c7c9e24bd', 'Mobility Management in Mobile Computing Environments', 'CONFERENCE', '10.1007/s00779-010-0328-2', NULL, 'Asian Conference on Intelligent Systems & Networks (AISN-2006)', '', '', '250-258', 2006, 'Scopus', 'T', 'Lalit Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO publication_departments (publication_id, department_id) VALUES ('1ae5db5f-e03f-500d-b158-5f3c7c9e24bd', '22222222-2222-2222-2222-222222222222') ON CONFLICT (publication_id, department_id) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('041aa59a-3d28-5a72-bb01-f27d9a36c386', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('608cf47d-35f3-579f-b117-cc1d637269d5', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('95fb4aed-efae-5004-a47d-7ba7f25d1d09', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('6f641618-319b-5606-99db-f05bbb991419', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('38406397-4eac-5f7f-90dd-a38b3ecd2d2c', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d840aed3-b19b-5196-8c84-2ddd86f9e024', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('ad5a2026-9ae7-557f-a1be-ee63c8df7dd1', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('2306867d-0ca7-53e5-b8c4-c99c287f189a', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('c46802f3-75a0-5799-a435-2d94b1660db2', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('2f01431c-e506-522f-ac02-2cd149a9a35b', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('147312dd-ed35-5286-a46f-e91d18bfb6a6', '4a251956-1179-50e2-bf7e-f3be7d5574e2', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('147312dd-ed35-5286-a46f-e91d18bfb6a6', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('147312dd-ed35-5286-a46f-e91d18bfb6a6', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 3)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('16fcec54-40c7-5341-b480-b2c9d8caa106', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('74efccc9-f765-590b-bfbc-51012214ee48', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('43953db5-915a-5444-a4fe-2c6587dc12af', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('9c1db53e-e0f3-558e-b4d6-8047c38817a8', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('4a87f47a-4bca-518a-96be-081e240c6a43', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('bedaf203-f1a8-53a0-98f0-d0ebf228cddc', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('b9c8f810-002b-5a60-88bf-6fd39ce39381', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('61944050-4bca-57a3-aeb0-2acb7cab62f2', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('97c4847c-4d3f-5a71-b397-ec3e94941457', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('cdad0392-1ca2-5af1-8851-3f18bcc4f17c', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('32aa4e67-f72e-5f11-af67-aabd83f66550', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('0bf7088c-181d-5c0d-965c-86b3da956db7', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('3382f362-e2cc-5b36-8682-39ff7bad1ba1', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('6da85ab4-cc7b-546e-a2f6-450c3aa34d10', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('deefff03-cbeb-5276-b45b-14f06a536067', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('deefff03-cbeb-5276-b45b-14f06a536067', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d0698f7a-625e-576f-b3b5-aef7c3b0b5dd', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d0698f7a-625e-576f-b3b5-aef7c3b0b5dd', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('57c4264d-75d1-5be7-b439-357f05d4492d', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('a9682550-aefe-59b7-9493-7758cb917ad8', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('a9682550-aefe-59b7-9493-7758cb917ad8', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1f656e15-fa3e-5c99-9bfd-300452d50b0b', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('23a48370-5ac8-5794-9a3a-eabe90ea17ce', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('58c1df26-d7c3-5d34-9e67-8a016c86746e', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('87bede1c-f3b9-5990-89dd-6f13bd6374a3', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('0780c0a9-71ef-5bde-ae98-b0c30e2a2efe', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('863ffcb7-ce2b-5c9a-b98d-dde3e56e9ea8', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('46e9786c-8f07-55b8-bda5-b03db682fb46', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('2250eae9-0fe4-5d22-bdf7-a920c0c45c66', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('beee7abf-d189-51ca-8cfc-8c58bfd999a3', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('4e4cfc5a-3258-5313-b1cb-449eb97af2fb', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('4127e130-de29-5dd5-a0e1-f91aaadc77b8', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('69d37708-c66f-57cf-bdda-4783bf8e150a', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('3b7a574c-b2ee-5ec5-8d29-3330753537e3', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('8820c112-b2e7-5b98-a6f0-033997b0d6bc', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('83cda2e0-23ff-56b5-910b-111dacc04f52', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d1d6969e-e068-59b1-8bf9-0a46e00b9158', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('ba1c13ef-f5a2-524c-a413-330832481d6b', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('5a7c51e1-f580-57b7-b583-b956d7952e17', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('90497dd8-431f-5a81-b83c-4f1913c7fb5d', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('721fbab8-2509-54b6-ab53-dc7fac54bf58', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('c16fc69d-4162-504f-807b-f5aa6c4b9805', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('7355f94a-aa37-58ab-8fa1-ac3852cc4e5e', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1042edf4-cc18-556f-8c42-57557c171b9f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1042edf4-cc18-556f-8c42-57557c171b9f', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1b61dce2-e874-5f67-b998-93017ea4421a', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1b61dce2-e874-5f67-b998-93017ea4421a', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('cf5358bb-e3c3-55fb-b87a-b6adaf988f42', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('797fa728-5036-515e-91d1-223157d5002e', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('02741521-efcf-5853-bdb6-09e71916f31f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('56ff0810-a0a6-523b-a6b4-179eee20ba66', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('21548da6-9e62-59c2-93fe-71c258a632a0', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('3956fa0f-d582-59df-939b-595f50b6a49e', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('7a039e9f-8c68-574d-8268-8cc003e3d62e', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('587195e4-f6ec-50be-a7f0-4402a6bdbf1a', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('587195e4-f6ec-50be-a7f0-4402a6bdbf1a', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('2f574b2b-e84d-52ab-944c-8016043d3a5f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('2f574b2b-e84d-52ab-944c-8016043d3a5f', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d303d201-c87a-592c-af38-4974da661d7f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('0835e139-5f00-50ef-b42c-f55c49433478', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('54de4036-5431-5112-aa0e-de38d83c1db9', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('54de4036-5431-5112-aa0e-de38d83c1db9', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1d950a0e-d43e-5a13-a9c2-b6f5c5da5f92', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('9120d8bb-53fd-52df-9daa-be400119ed34', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('9120d8bb-53fd-52df-9daa-be400119ed34', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('da88eb95-ec32-5312-b55b-39c146866ef9', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('14bb7e22-2de0-58ff-99f2-cc86a2a1b671', '93a853b0-b5ce-5ed1-b715-f88f25ed9e76', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('8e3e64ac-91ff-5d01-970a-2ae10bd0f978', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('601b392c-cd74-5093-a374-3c547cd00c71', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('47703d8c-a44a-5fb3-b08a-e56fe9b94eb6', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('38d9fa23-ee81-595f-b80a-6205d8c52d37', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('8c91acdb-25c0-5909-902a-c6efb25da46f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('0939f3a2-1798-57cb-ab55-c761f687b826', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('a4c7ed5e-281e-531a-b89b-3ac23a1d2dc2', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('5e949b9d-e742-5b1e-b5ef-d98672628863', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('2acd58f8-7533-536a-a06a-1ea6bf2c193b', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('ccd76573-becd-5c7e-a31a-130a2b8cb96b', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('8aa9b95c-03f1-5e50-a560-6440ca5e6d5c', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('f5db1d65-e7c2-5885-b79c-4d9c9a462068', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('6e694ac8-9df2-5931-aecf-c16c7e353766', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('6e694ac8-9df2-5931-aecf-c16c7e353766', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('eeb27591-2cfc-5add-87c0-efb6011255eb', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('46bfe832-b4f2-5e41-9749-8774fb19c391', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('5900d229-20a4-593d-92ed-172b0ca78fea', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('f0b67144-12a2-59ff-973c-338e0cb1f5fc', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('5b2fefc9-678e-537f-b101-1f1812bae3af', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('6fe01bab-799b-56cf-af98-12dad4e8ce5f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('e38a707e-b497-5ad9-b11e-7ed50a057035', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('e38a707e-b497-5ad9-b11e-7ed50a057035', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('5e40c07d-68fe-5d9e-807b-79341a947c3b', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('5e40c07d-68fe-5d9e-807b-79341a947c3b', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d1e38c9e-a1f7-5601-802a-b5065315b583', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('403561c8-fa85-510e-9622-47de8a010d0a', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('7a5cbba9-e872-5ec2-bb4f-712dc5cb2441', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('8a19a8a8-fcbf-5c09-abf8-370bdd441e43', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('83f440da-0406-56b0-981e-04fad640518f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('397ce628-8627-54e6-aa5a-d9df03aee9fb', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('9472fd73-35f4-5c32-93df-91fc56c401c6', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('a1404300-73d5-5827-803f-bc253249a4f5', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('be57796e-af96-5a64-bacc-eb5208e9f51b', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('f209edc7-8373-557e-8ca9-60fe8d43874d', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('f209edc7-8373-557e-8ca9-60fe8d43874d', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('f209edc7-8373-557e-8ca9-60fe8d43874d', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Co-Author', 3)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('eaf6d835-1365-5fd5-a344-4c6891c9e201', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('eaf6d835-1365-5fd5-a344-4c6891c9e201', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('c8e70143-0fa5-59ac-ab2e-8caa2f6bc6bf', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('a7baed80-a1bb-5348-b7a9-7952e6b2b1da', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('a7baed80-a1bb-5348-b7a9-7952e6b2b1da', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Co-Author', 2)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('00191a99-312a-5715-b1d7-083f5760c9dd', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('d90b5b86-48db-51e4-8d89-5b8226828a09', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1a484312-a899-5dc6-91cd-7c44f2d05378', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('45d2cf7b-05ba-5ebf-8899-f6cd87ad936a', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('03e629ac-e56d-5384-a6ea-39a815d8dab1', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('62969bd4-4645-5b75-b612-f1a80cac76cc', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('89803d05-f1b0-56ce-9a00-53af25170f34', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;
INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order)
VALUES ('1ae5db5f-e03f-500d-b158-5f3c7c9e24bd', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Co-Author', 1)
ON CONFLICT (publication_id, author_order) DO NOTHING;

-- 11. Sponsored Projects
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('a66f7f92-407c-5a45-8aef-61a39d3cd96e', '5th International Conference on Machine Learning, Image Processing, Network Security and Data Sciences', 'SSY/2023/001110', 'SERB', 'Completed', 2023, 350000.00, '22222222-2222-2222-2222-222222222222', 'Dr. Arun Kumar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('a66f7f92-407c-5a45-8aef-61a39d3cd96e', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('c17ba485-4f85-5cbe-b4de-36976e6aabb0', 'A Deep Learning based System for Potato Crops Leaf Disease Detection', 'CST/D-701', 'UP-CST', 'Ongoing', 2024, 130800.00, '22222222-2222-2222-2222-222222222222', 'Dr. Prakash Kumar Singh, Dr. Arun Kumar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('c17ba485-4f85-5cbe-b4de-36976e6aabb0', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('19ee8ead-54f8-54cf-8e0c-19f1bc9c962e', 'Real time cyberbullying detection for Koo and Twitter using Machine Learning and Deep Learning methods.', 'CST/D-12', 'UP-CST', 'Ongoing', 2024, 130800.00, '22222222-2222-2222-2222-222222222222', 'Dr. Vibhash Yadav, Dr. Arun Kumar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('19ee8ead-54f8-54cf-8e0c-19f1bc9c962e', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('a50f6370-7b7e-5a0d-8b93-d8a846320265', 'Information Security Education and Awareness (ISEA) Phase – II', 'NIT/HMR/R&C/ISEA/PROJECT/357-360', 'Ministry of Electronics & Information Technology (MeitY)', 'Completed', 2015, 365000.00, '22222222-2222-2222-2222-222222222222', 'Dr. TP Sharma, Dr. Naveen Chauhan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('a50f6370-7b7e-5a0d-8b93-d8a846320265', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('8a15b03c-8145-5794-86f0-e7043cfc2a54', 'Post Disaster Communication Recovery Using Mobile Ad-Hoc Networks', 'SCSTE/F(8)-1/2016-Vol.-I-5592', 'HP State Council for Science Technology & Environment', 'Completed', 2016, 663000.00, '22222222-2222-2222-2222-222222222222', 'Dr. Naveen Chauhan, Dr. Rajeev Kumar', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('8a15b03c-8145-5794-86f0-e7043cfc2a54', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('5c7ecfac-0460-5973-b7c7-98786142699d', 'Spiking neural network based computational model for Internet of things', '', 'NPIU,MHRD', 'Completed', 2020, 1137000.00, '22222222-2222-2222-2222-222222222222', 'Mohammad Khalid Pandit, Mohammad Ahsan Chishti, Roohie Naaz, Assif Assad, Shioaib Amin', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('5c7ecfac-0460-5973-b7c7-98786142699d', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('7f0354db-55d8-502e-b354-6f2e17c5c573', 'Adaptive deep neural networks for IoT', '', 'TEQIP, IUST', 'Completed', 2020, 200000.00, '22222222-2222-2222-2222-222222222222', 'Mohammad Khalid Pandit, Shoaib Amin Banday', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('7f0354db-55d8-502e-b354-6f2e17c5c573', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('d71261a0-2e23-5f90-a2d7-34c20f94dd74', 'Development of CADe and CADx systems for Brain Tumors', '', 'TEQIP, IUST', 'Completed', 2020, 200000.00, '22222222-2222-2222-2222-222222222222', 'Shoaib Amin Banday, Mohammad Khalid Pandit', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('d71261a0-2e23-5f90-a2d7-34c20f94dd74', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('5a7f7c2c-6573-5cda-b38c-82bf6f782e71', 'Using Longitudinal data for early detection and progress monitoring Alzheimer’s disease', '', 'JK DST', 'Ongoing', 2022, 709000.00, '22222222-2222-2222-2222-222222222222', 'Assif Assad, Mohammad Khalid Pandit, Rayees Dar', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('5a7f7c2c-6573-5cda-b38c-82bf6f782e71', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('48dc0905-e51d-5b15-a0b6-acc84ab02e43', 'Secure Design Scheme for Blockchain-based Traceable Certification System', 'PCC-Grant-202121', 'Prince Mohammad Bin Fahd University, Saudi Arabia', 'Completed', 2021, 428074.00, '22222222-2222-2222-2222-222222222222', 'Dr. Robin Singh Bhadoria', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('48dc0905-e51d-5b15-a0b6-acc84ab02e43', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('8713dbb0-bc1a-5ff1-9199-d360b6837015', 'Compressed Parallel Wavelet Tree Based Semantic Search', 'CST/D-2783', 'UP-CST', 'Completed', 2019, 104400.00, '22222222-2222-2222-2222-222222222222', 'Dr. Sonam Gupta, Dr. Arun Kumar Yadav', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('8713dbb0-bc1a-5ff1-9199-d360b6837015', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('8ee8e08e-c7f3-500c-b3b9-b781e5b8a57d', 'Efficient Forest Fire Detection Mechanism using Wireless Sensor Networks', 'STC/F(8)-6/2019(R&D2019-20-417 dated 29-6-2020', 'HIMCOSTE', 'Completed', 2020, 560000.00, '22222222-2222-2222-2222-222222222222', 'Dr Siddhartha Chauhan, Dr Pardeep Singh', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('8ee8e08e-c7f3-500c-b3b9-b781e5b8a57d', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('f1b5cefc-a2f6-52b6-b135-6dbd650c023b', 'Information Security Education and Awareness Project Phase II', 'L-14011/20/2014-HRD Dated 12.02.2015 and 1(2)/2012-ISEA(Vol.II) dated 27.03.2015', 'MeitY', 'Completed', 2021, 3700000.00, '22222222-2222-2222-2222-222222222222', 'Dr. T.P. Sharma, Dr. Naveen Chauhan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('f1b5cefc-a2f6-52b6-b135-6dbd650c023b', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('00c1d29d-5999-50e9-9915-7b0ad8331c7d', 'Mobile Device Security', 'NIT Hamirpur L-14017/1/2022-HRD', 'MeitY', 'Ongoing', 2024, 20100000.00, '22222222-2222-2222-2222-222222222222', 'Dr. T.P. Sharma, Dr. Naveen Chauhan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('00c1d29d-5999-50e9-9915-7b0ad8331c7d', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', 'Augmentation of Research Facilities in CSE Department', 'SR/FST/ET-1/2023/1308', 'DST', 'Ongoing', 2024, 22300000.00, '22222222-2222-2222-2222-222222222222', 'Dr. Naveen Chauhan(CO-PI), Dr Rajeev Kumar (Co-PI)', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('a68c8973-433d-5f41-89cd-7dde9d911b04', 'ICT Based Solution to Expedite the Efficient Delivery of Care to the Patient of Heart Attack', 'STC/F(8)-2(R&D 20-21)-273', 'HP State Council for Science Technology & Environment', 'Completed', 2021, 650000.00, '22222222-2222-2222-2222-222222222222', 'Dr. Naveen Chauhan, Prof. Lalit Kumar Awasthi (DoCSE NIT Hamirpur), Dr. Rajeev Kumar (DoCSE NIT Hamirpur) and Dr. Rajesh Sharma (Deptt. of Cardiology IGMC Shimla)', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('a68c8973-433d-5f41-89cd-7dde9d911b04', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('8cf29dd7-7c0e-58e2-944f-155df57df489', '"Mobile Devise Security" Information Security Education and Awareness (ISEA) Project Phase III', 'F.NO. L-14017/1/2022-HRD', 'MeitY', 'Ongoing', 2024, 20600000.00, '22222222-2222-2222-2222-222222222222', 'Dr. T.P. Sharma, Dr. Naveen Chauhan', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('8cf29dd7-7c0e-58e2-944f-155df57df489', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('38f9769d-0cd4-5ab7-8865-c936c3bcbf76', 'Prototype development of a non-invasive plasmonic fiber sensor using nanomaterials for detection of cortisol salivary biomarker', '', 'Science and enginerring research board', 'Ongoing', 2024, 601271.00, '22222222-2222-2222-2222-222222222222', 'Prof. Lalit Awasthi(PI)', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('38f9769d-0cd4-5ab7-8865-c936c3bcbf76', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('c9cb693d-4f88-564d-af94-8b6215d10654', 'Moleculer of Anthraqunone based anti-cancer Drug Design', '', 'Ministry of human Resource Development.Govt.of India', 'Completed', 2005, 1200000.00, '22222222-2222-2222-2222-222222222222', 'Prof. Lalit Awasthi(PI)', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('c9cb693d-4f88-564d-af94-8b6215d10654', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('d042e9f0-e0e0-5384-9337-beef9c00c8d4', 'An energy Efficient Air Quality Monitoring System using wireless sensor Network (2019-20)', '', 'TEQIP, IUST', 'Completed', 2019, 400000.00, '22222222-2222-2222-2222-222222222222', 'Prof. Lalit Awasthi(PI)', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('d042e9f0-e0e0-5384-9337-beef9c00c8d4', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('fac06be5-44b8-5d69-9686-e02ce9e06414', 'An intelligent network analyzer cum patcher for advance secunty hardening', '', 'DST', 'Ongoing', 2021, 7279000.00, '22222222-2222-2222-2222-222222222222', 'Prof. Lalit Awasthi(PI)', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('fac06be5-44b8-5d69-9686-e02ce9e06414', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('ce135f80-74ae-5a14-919d-169a43bc9f5f', 'RVS Study of Important Buildings, Transportation and Communication System for Shimla City', '', 'Municipal Corporation Simla', 'Completed', 2013, 350000.00, '22222222-2222-2222-2222-222222222222', 'Lead PI, Dr. Kamlesh Dutta', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('ce135f80-74ae-5a14-919d-169a43bc9f5f', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('c4b51c14-3a44-583e-bf3b-34320cc7cfae', 'Information Security Awareness Project', '', 'DieTY', 'Completed', 2014, 830000.00, '22222222-2222-2222-2222-222222222222', 'Dr. Kamlesh Dutta', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('c4b51c14-3a44-583e-bf3b-34320cc7cfae', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, lead_department_id, raw_investigators, workflow_status)
VALUES ('da459cb7-be4e-55ee-84bf-a4a42c586c15', 'Cisco Networking Academy Sponsored by UNDP/APDP/CISCO', '', 'Cisco/UNDP', 'Completed', 1999, 0.0, '22222222-2222-2222-2222-222222222222', 'Dr. Kamlesh Dutta', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO project_departments (project_id, department_id, is_lead) VALUES ('da459cb7-be4e-55ee-84bf-a4a42c586c15', '22222222-2222-2222-2222-222222222222', TRUE) ON CONFLICT (project_id, department_id) DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('a66f7f92-407c-5a45-8aef-61a39d3cd96e', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('c17ba485-4f85-5cbe-b4de-36976e6aabb0', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('19ee8ead-54f8-54cf-8e0c-19f1bc9c962e', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('a50f6370-7b7e-5a0d-8b93-d8a846320265', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('8a15b03c-8145-5794-86f0-e7043cfc2a54', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('8a15b03c-8145-5794-86f0-e7043cfc2a54', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('5c7ecfac-0460-5973-b7c7-98786142699d', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('7f0354db-55d8-502e-b354-6f2e17c5c573', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('d71261a0-2e23-5f90-a2d7-34c20f94dd74', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('5a7f7c2c-6573-5cda-b38c-82bf6f782e71', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('48dc0905-e51d-5b15-a0b6-acc84ab02e43', '7f377458-de96-52a7-b8cf-04e50369469a', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('8713dbb0-bc1a-5ff1-9199-d360b6837015', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('8ee8e08e-c7f3-500c-b3b9-b781e5b8a57d', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('f1b5cefc-a2f6-52b6-b135-6dbd650c023b', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('00c1d29d-5999-50e9-9915-7b0ad8331c7d', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', '33007428-2ecd-5b52-93aa-b6849142c098', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('ad15faf7-1b61-5abb-a3ea-e7fdaa9443cc', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('a68c8973-433d-5f41-89cd-7dde9d911b04', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('8cf29dd7-7c0e-58e2-944f-155df57df489', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('38f9769d-0cd4-5ab7-8865-c936c3bcbf76', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('c9cb693d-4f88-564d-af94-8b6215d10654', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('d042e9f0-e0e0-5384-9337-beef9c00c8d4', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('fac06be5-44b8-5d69-9686-e02ce9e06414', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('ce135f80-74ae-5a14-919d-169a43bc9f5f', '33007428-2ecd-5b52-93aa-b6849142c098', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('c4b51c14-3a44-583e-bf3b-34320cc7cfae', '33007428-2ecd-5b52-93aa-b6849142c098', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;
INSERT INTO project_members (project_id, faculty_id, member_name, role)
VALUES ('da459cb7-be4e-55ee-84bf-a4a42c586c15', '33007428-2ecd-5b52-93aa-b6849142c098', 'Investigator', 'PI')
ON CONFLICT DO NOTHING;

-- 12. Patents
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('e241eac3-887a-53a4-8b69-e04a6a393b42', 'AN AIR POLLUTION CONTROL SYSTEM WITH AIR FRESHENER DISPENSING UNIT AND AN AIR POLLUTION CONTROL SYSTEM WITH AIR FRESHENER DISPENSING UNIT AND WORKING METHOD THEREOF', 'Published', '202311027129 A', NULL, 2023, '2023-04-12', NULL, 'Dr. Jyoti Srivastava, Dr. Prabhat Kumar Srivastava, Dr. Ashish Kumar Srivastava, Mr. Nishant Anand, Dr. Ajay Kumar Gupta', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('e241eac3-887a-53a4-8b69-e04a6a393b42', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('1cf6bb0f-ee2d-530b-b65d-9d91469be76e', 'VIOLENCE ALERT TECHNOLOGY', 'Published', '202311065880 A', NULL, 2023, '2023-09-30', NULL, 'Dr. Jyoti Srivastava, Dr. Ashish Kumar Srivastava', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('1cf6bb0f-ee2d-530b-b65d-9d91469be76e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('2147323b-8c83-57e4-bb66-3417467cba95', 'METHOD FOR AUTHENTICATING AND VALIDATING QUICK RESPONSE CODE', 'Published', '202121010704', NULL, 2021, '2021-03-14', '2021-09-04', 'Dr. Robin Singh Bhadoria', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('2147323b-8c83-57e4-bb66-3417467cba95', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('7758be4c-d178-54cb-8ccd-22a998beaa4b', 'SYSTEM AND METHOD FOR AIDING DURING MEDICAL EMERGENCY', 'Granted', '202221006822', '202221006822', 2024, '2022-02-09', '2024-03-15', 'Dr. Robin Singh Bhadoria', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('7758be4c-d178-54cb-8ccd-22a998beaa4b', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('dcc0cfe5-3950-5dd5-a28d-5cb9c0b155fd', 'An Advanced Methodology for Accident Monitoring based on IoT/ ML/ AI/ and cyber security via Cloud Technology', 'Published', '202341058977', NULL, 2023, '2023-02-09', '2023-06-10', 'Dr. Pardeep Singh', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('dcc0cfe5-3950-5dd5-a28d-5cb9c0b155fd', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('0c09ea79-a48f-5cd8-aba9-3dce6efb97e7', 'INTELLIGENT PROCESS AND METHOD TO CONTROL THE REAL-TIME TRAFFIC USING IOT BASED SYSTEM.', 'Published', '202111019430', NULL, 2023, '2021-04-28', '2021-05-21', 'Dr. Pardeep Singh', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('0c09ea79-a48f-5cd8-aba9-3dce6efb97e7', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('f133432c-a285-5897-be6a-e124d1020e68', 'DRIVER DROWSINESS DETECTION AND WATER SPRINKLER ALARM SYSTEM FOR VEHICLES', 'Granted', '560046', '560046', 2026, '2023-06-03', '2025-02-11', 'ARUN KUMAR YADAV, MOHIT KUMAR', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('f133432c-a285-5897-be6a-e124d1020e68', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('d8d54b8c-139b-5eb1-ab6b-66b94f106f81', 'IOT BASED DATA PROCESSING DEVICE', 'Granted', '425119-001', '425119-001', 2024, '2024-07-29', '2024-08-27', '1.Vishnu Kumar Prajapati 2. Praveen Kumar Singh 3.Prof. T.P. Sharma 4.Kapil Kumawat 5.Mohammad Danish 6.Prof. Lalik Kumar Awasthi', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('d8d54b8c-139b-5eb1-ab6b-66b94f106f81', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('2cdfd240-ad8a-5013-975f-f018aa7d635a', 'A SMART FAN ASSEMBLY FOR MULTI-DIRECTIONAL AIR BLOWING WITH AIR PURIFICATION SYSTEM', 'Published', '', NULL, 2023, '2023-12-08', '2023-12-08', 'Dr. Robin Singh Bhadoria', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('2cdfd240-ad8a-5013-975f-f018aa7d635a', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('bdeb8807-bf76-572b-9029-f5835f13186e', 'A SMART FAN ASSEMBLY FOR MULTI-DIRECTIONAL AIR BLOWING WITH AIR PURIFICATION SYSTEM', 'Published', '', NULL, 2023, '2023-12-08', '2023-12-08', 'Dr. Robin Singh Bhadoria', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('bdeb8807-bf76-572b-9029-f5835f13186e', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('91752686-ef34-5ef3-bd13-bfd346962fe1', 'An IoT based Aid for Monitoring Hallucinations and Assisting in Cognitive Rehabilitation of Schizophrenia Patient', 'Published', '202211072524', NULL, 2022, '2022-12-30', NULL, 'NITH Inventors', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('91752686-ef34-5ef3-bd13-bfd346962fe1', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('39126966-d0c4-5c68-be89-db11af040799', 'Bhukamp Rodhi E-chakr: Himachal Pradesh ke jilon ke liye bhukamp pratirodhi gair engineering bhawan nirman e-nirdeshika', 'Granted', 'SW-8931/2016', 'SW-8931/2016', 2017, '2017-07-13', NULL, 'NITH Inventors', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('39126966-d0c4-5c68-be89-db11af040799', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('579c166e-0862-5b97-9eb5-5f938f870e64', 'Retrofitting E-chakri: mobile application on android platform for guiding non-engineering aspects of retrofitting of the buildings in Himachal Pradesh from earthquake resistance point of view', 'Granted', 'SW-8930/2016', 'SW-8930/2016', 2017, '2017-07-13', NULL, 'NITH Inventors', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('579c166e-0862-5b97-9eb5-5f938f870e64', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('746b44ca-bf14-5296-9328-c2a24e0da5df', 'Cobweb cleaning broom with non-electric rotating head for effective cleaning', 'Granted', '201721003190', '201721003190', 2017, '2017-01-27', '2023-05-19', '1. Sangeeta Sharma 2. Priyanka Verma 3. Nitesh Bharot', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('746b44ca-bf14-5296-9328-c2a24e0da5df', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patents (id, title, status, application_number, grant_number, year, filing_date, grant_date, raw_inventors, workflow_status)
VALUES ('32d13ebc-c399-55b0-8448-9f0ebc7dbef7', 'DEVICE FOR CONVERSION OF NORMAL PROJECTION SURFACE TO TOUCH SENSITIVE SMART PROJECTION SCREEN', 'Published', '202311030560', NULL, 2023, '2023-04-28', NULL, 'ARUN KUMAR YADAV, MOHIT KUMAR', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO patent_departments (patent_id, department_id) VALUES ('32d13ebc-c399-55b0-8448-9f0ebc7dbef7', '22222222-2222-2222-2222-222222222222') ON CONFLICT (patent_id, department_id) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('e241eac3-887a-53a4-8b69-e04a6a393b42', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('1cf6bb0f-ee2d-530b-b65d-9d91469be76e', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('2147323b-8c83-57e4-bb66-3417467cba95', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('7758be4c-d178-54cb-8ccd-22a998beaa4b', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('dcc0cfe5-3950-5dd5-a28d-5cb9c0b155fd', '4a251956-1179-50e2-bf7e-f3be7d5574e2', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('0c09ea79-a48f-5cd8-aba9-3dce6efb97e7', '4a251956-1179-50e2-bf7e-f3be7d5574e2', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('f133432c-a285-5897-be6a-e124d1020e68', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('f133432c-a285-5897-be6a-e124d1020e68', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Inventor', 2)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('d8d54b8c-139b-5eb1-ab6b-66b94f106f81', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('d8d54b8c-139b-5eb1-ab6b-66b94f106f81', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Inventor', 2)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('2cdfd240-ad8a-5013-975f-f018aa7d635a', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('91752686-ef34-5ef3-bd13-bfd346962fe1', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('39126966-d0c4-5c68-be89-db11af040799', '33007428-2ecd-5b52-93aa-b6849142c098', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('579c166e-0862-5b97-9eb5-5f938f870e64', '33007428-2ecd-5b52-93aa-b6849142c098', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('32d13ebc-c399-55b0-8448-9f0ebc7dbef7', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Inventor', 1)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;
INSERT INTO patent_inventors (patent_id, faculty_id, inventor_name, inventor_order)
VALUES ('32d13ebc-c399-55b0-8448-9f0ebc7dbef7', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Inventor', 2)
ON CONFLICT (patent_id, inventor_order) DO NOTHING;

-- 13. Consultancies
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('8f7691d1-2f39-5190-baf2-fa9bf4547845', '22222222-2222-2222-2222-222222222222', 'Consultancy Service to Kangra Central Cooperative Bank for establishment of ATMs', 'Kangra Central Cooperative Bank', '', 'completed', 545770.00, 2024, 'Dr. T.P. Sharma, Dr. Narottam Chand, Mr. K.S. Pandey, Dr. S.K. Soni, Dr. Ashok Kumar, Mr. Anil Kumar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('9f9df67a-79d7-5094-8747-96cf16df5bb8', '22222222-2222-2222-2222-222222222222', 'Consultancy Service to Kangra Central Cooperative Bank for establishment of CBS and Internet Banking', 'Kangra Central Cooperative Bank, Dharamsala', '', 'completed', 4537086.00, 2024, 'Dr. T.P. Sharma, Dr. Narottam Chand, Mr. K.S. Pandey, Dr. S.K. Soni, Dr. Ashok Kumar, Mr. Anil Kumar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('41b71f0f-6007-5979-8e92-5fe9490bb421', '22222222-2222-2222-2222-222222222222', 'Consultancy Service to Kangra Central Cooperative Bank for establishment of surveillance and Biometric Attendance System', 'Kangra Central Cooperative Bank', '', 'completed', 540569.00, 2024, 'Dr. T.P. Sharma, Dr. Narottam Chand, Mr. K.S. Pandey, Dr. S.K. Soni, Dr. Ashok Kumar, Mr. Anil Kumar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('2313c665-a86c-5f67-b381-c1ed6e1d77c6', '22222222-2222-2222-2222-222222222222', 'IPV6 Consultancy Services for RINL, Visakhapatnam Steel Plant', 'RINL, Visakhapatnam Steel Plant', '', 'completed', 2000000.00, 2024, 'Dr. Kamlesh Dutta')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('31e6bad6-7121-5b39-b575-c3b3b42d0d10', '22222222-2222-2222-2222-222222222222', 'Automation of Dr. Rajendra Prasad Govt. Medical College, Kangra', 'DR.R.P.G.M.C Kangra at Tanda', '', 'ongoing', 5389000.00, 2025, 'Dr. Siddhartha Chauhan, Mr. Ashwini Sharma and Mr. Rajesh Sharma')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('10571e4d-4b17-5bf7-92f6-49cc0c91d326', '22222222-2222-2222-2222-222222222222', 'Establishment of ATMs, EFT switching and Allied Services to Punjab State Cooperative Bank and DCCBs, PSCB Chandigarh', 'PSCB, Chandigarh', '', 'completed', 4085000.00, 2025, 'Dr. Siddhartha Chauhan and Mr. Ashwini Sharma')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('b96dc60c-2af0-5ce5-a416-508f04746475', '22222222-2222-2222-2222-222222222222', 'Migration from IPv4 to IPv6 of 27 LANs and Applications and websites of RINL, VIZAG Steel, Vishakhapatnam', 'RINL VIZAG Steel', '', 'completed', 2000000.00, 2025, 'Dr. Mrs. Kamlesh Dutta, Dr. Siddhartha Chauhan and Mr. K.S. Pandey')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancies (id, department_id, title, client_name, consultancy_number, status, sanctioned_amount, year, raw_faculty)
VALUES ('03838335-38c9-5149-9f33-3f4b9c52d60e', '22222222-2222-2222-2222-222222222222', 'Providing Consultancy for IT Services (Setting up of Integrated Control Command Centre) for Dharamshala Smart City Project', 'Dharamshala Smart City Limited, Dharmshala', '', 'completed', 10600000.00, 2025, 'Dr. Siddhartha Chauhan')
ON CONFLICT (id) DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('8f7691d1-2f39-5190-baf2-fa9bf4547845', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('9f9df67a-79d7-5094-8747-96cf16df5bb8', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('41b71f0f-6007-5979-8e92-5fe9490bb421', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('2313c665-a86c-5f67-b381-c1ed6e1d77c6', '33007428-2ecd-5b52-93aa-b6849142c098', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('31e6bad6-7121-5b39-b575-c3b3b42d0d10', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('10571e4d-4b17-5bf7-92f6-49cc0c91d326', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('b96dc60c-2af0-5ce5-a416-508f04746475', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;
INSERT INTO consultancy_members (consultancy_id, faculty_id, member_name, role)
VALUES ('03838335-38c9-5149-9f33-3f4b9c52d60e', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Consultant', 'Lead Consultant')
ON CONFLICT DO NOTHING;

-- 14. Research Supervisions
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('89cf0d45-2c19-5fc9-aa96-58baac524e51', '22222222-2222-2222-2222-222222222222', 'PhD', 'Akash Verma', '22RCS006', 'Deep Learning based Brain Tumor Segmentation and Classification from MRI Images', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('158bad54-810b-5a55-9f73-19eda93497a3', '22222222-2222-2222-2222-222222222222', 'MTech', 'Akash Verma', '19M520', 'Image Caption Generation Using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('aed211d4-2436-502d-9d0f-853b09fdade2', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sanjeevani', '19MCS519', 'Retinal Blood Vessel Segmentation Using Deep Learning Concepts Based on U-NET Architecture of CNN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fe1befeb-1d6d-59cc-a7ff-f6fdf20778c3', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shubham Bharti', '19MCS506', 'Cyberbullying Detection in social media Text', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('e2e7f0d8-3555-5296-b667-1786637e2146', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shweta Kushwaha', '19MCS527', 'Detection Distributed Denial service attacks in IoT devices using Network Traffic Capture', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('65f0c2b8-0458-5989-bd89-285a46d6d9cb', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ashish Dhiman', '19M538', 'Sentimental Classification in Hindi Text using Hybrid Deep Learning Mode', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('4ffa703e-4750-5b6b-baec-4d7ce84530c5', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kartikey Tiwari', '19M551', 'Multi Document Extractive Text Summarization using Statistical Approach', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('d0e64858-c78c-5064-a524-ff7adc9f68ad', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mohammed Usman Syed', '20MCS109', 'Skin Cancer Classification using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('53a12ba0-fee7-5de8-a93a-8bb2d2df7311', '22222222-2222-2222-2222-222222222222', 'MTech', 'Krishan Kumar', '17M518', 'Fingerprint Detection and Matching using Deep Learning and Gabor Features', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('f4dd4221-8939-5938-aff9-f0e72928b4d7', '22222222-2222-2222-2222-222222222222', 'MTech', 'Manoj Kumar', '17M537', 'Bird Species Classification and Detection using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('a36443a7-3bae-5a19-8f45-c877e93f9a3f', '22222222-2222-2222-2222-222222222222', 'PhD', 'Vandana', '24RCS004', 'Application of Machine Learning and Natural Language Processing in Low Resource Language', 'Ongoing', '. .')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0949f068-fc98-57c7-80e0-dece98c8bab3', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shivani', '185504', 'Underwater Image Enhancement using Convolutional Neural Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fca453be-6ea6-525c-b9d3-9ad31c361d06', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rajan Kumar', '21MCS110', 'Scientific Document Text Summarization using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6c1a6761-9915-5134-8dbf-8a1864692558', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhishek Kumar', '185540', 'Word Vectorization in Bhojpuri and Maithili using Deep Learning Methods', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('05bfe978-70ad-57a0-8280-82eb27090221', '22222222-2222-2222-2222-222222222222', 'MTech', 'Divya Rathod', '21MCS106', 'Neural Machine Translation for Hindi-English using Character-Level Encoding', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('833347c1-6eaf-5817-8d33-c896b5b7f57f', '22222222-2222-2222-2222-222222222222', 'MTech', 'Saurya Pandey', '185537', 'Skin Cancer Detection using Squeeze-and -Extractive Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('64985d54-f998-5672-a405-5d275cb6857e', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rahul Kumar', '21MCS008', 'Brain Tumor Segmentation Using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c0dcd00f-fddc-5628-9f87-be692172b321', '22222222-2222-2222-2222-222222222222', 'MTech', 'Anant Ranghi', '21MCS119', 'Hate Speech Detection in Dravidian Languages using Character-Level Deep Learning Framework', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('50f80197-a103-5f63-a1be-8c4f2a79e03d', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kunal Shay', '21MCS006', 'Classification of Cancer type using Geometrical Deep Learning Models', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0830533d-9c5f-534b-b0c4-358385baedfb', '22222222-2222-2222-2222-222222222222', 'MTech', 'Harsh Sharma', '195548', 'Efficient Net and Cross-Attention Based Multimodal Emotion Detection from Audio-Visual Data.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('20bd6356-6944-5960-9684-e6afe17b6568', '22222222-2222-2222-2222-222222222222', 'MTech', 'Tushar Gupta', '22MCS010', 'Improving Topic Modeling through a Hybrid Approach Utilizing LDA, BERT and Clustering Technique.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('8e1b1c82-4957-5377-bb45-e90914cbae27', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rishabh Deo Singh', '195553', 'A Multimodal approach for cyberbullying detection in Social-Media Posts.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('133d78af-42c8-56b1-88d3-8374aa423d9e', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhishek Suraj', '195541', 'Instagram Fake Profile Detection Using Deep Learning.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7dce3209-d5a7-5374-a079-545ced46ce22', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vijay Kumar', '195538', 'Machine Translation for Low-Resource and Morphologically Rich Languages: Focusing on the Hindi-Kangri Pair.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0b671db0-3817-5fdb-baff-6018f976114b', '22222222-2222-2222-2222-222222222222', 'MTech', 'Akshay Kumar', '195505', 'A Multimodal Approach for Early Autism Spectrum Disorder Detection in Young Children', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('18b7044c-52fb-5c22-87ab-521164a52609', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shahil Sharma', '22MCS111', 'Landslide Detection using Deep Learning.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7e599ffe-e9e3-5fe4-b839-8e96dd7d0fa4', '22222222-2222-2222-2222-222222222222', 'MTech', 'ARUN SHARMA', '', 'Trend prediction of stock price using Financial News and Technical Indicator', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('966f72de-502e-55d6-b5fa-6191bab55f57', '22222222-2222-2222-2222-222222222222', 'MTech', 'NAVAM SHARMA', '', 'Graph Based Extractive Text Summarizer', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('9285afcd-7e62-5345-bc42-282cae3f8509', '22222222-2222-2222-2222-222222222222', 'MTech', 'MANICK', '', 'Cassava Leaf Disease Detection Using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('30833ea6-a271-5e43-98ea-a9835ebe5a30', '22222222-2222-2222-2222-222222222222', 'MTech', 'TANVI MAHAJAN', '', 'Early-Stage Dementia Detection by Optimize Feature Weights with Ensemble Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6e8d716b-6aff-5d49-90ba-ba6eef7b1277', '22222222-2222-2222-2222-222222222222', 'MTech', 'AMIT KUMAR', '', 'Hate Speech Detection Using Twitter Dataset', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6e10569c-d6be-5cb7-bca6-29b02b67588c', '22222222-2222-2222-2222-222222222222', 'MTech', 'HARSHA VARDHAN SAHOO', '', 'An Explainable NLP Framework for Sentiment Analysis using Interpretable ML and XAI', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c51763df-0983-5ea0-be59-504d81c1584f', '22222222-2222-2222-2222-222222222222', 'MTech', 'Johan Anish', '', 'Exploring the Effectiveness of Combined Cosine Similarity and Convolutional Neural Networks for Text Similarity Analysis', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('bc7468f1-0370-5f41-8434-e0d8f9240559', '22222222-2222-2222-2222-222222222222', 'MTech', 'Varun Malik', '', 'Automatic text summary evaluation metric', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('d9a54426-2920-53ed-8b74-aec65ab1fd1a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhay Maurya', '', 'Abstractive Text Summarization using Reinforcement Learning For Sequence to Sequence', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fbe916df-2dca-5f58-af89-ac82c3837666', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shubhiv Dogra', '', 'Sentiment analysis using the Bi-LSTM model on the Amazon Unlocked Mobile dataset', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('4afbb066-cdf2-550d-bd65-a511da8639db', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rishabh Dhenkawat', '', 'Deep Learning Architectures Ensembling via Liquid State Network for Ovarian Cancer Identification from Histopathology Images', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6fff9b9a-a56c-5266-b741-699c3669ebf6', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhijit Boban', '', 'Neural Machine Translation for English to Hindi', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('25ffa6df-285e-5b3f-8a71-dd018412ef33', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shashank Bhushan', '', 'An Integrated Deep Learning Approach for Teeth Disease Classification', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b3227feb-e6ff-5b1c-8812-b3a72b8c86c0', '22222222-2222-2222-2222-222222222222', 'PhD', 'Brij Bihari Dubey', '', 'Improving Data Availability in Vehiular Ad Hoc Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ed5e2d60-2ec4-5a16-bbf1-610c4cf03614', '22222222-2222-2222-2222-222222222222', 'PhD', 'Rajesh Sharma', '', 'Energy Efficient Data Dissemination in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('180b3ea4-3fb6-5269-8a5b-70715a57144f', '22222222-2222-2222-2222-222222222222', 'PhD', 'Prashant Kumar', '', 'Resource Optimization in Opportunistic Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('bc5c0cd0-908e-598d-9045-3fe0e010b9f0', '22222222-2222-2222-2222-222222222222', 'PhD', 'Rajeev Kumar', '', 'Improving Peformance of Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ea8f6f4b-0c76-5c25-9b07-e7c4705e739a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Amarjeet Kaur', '', 'AFDEP: Agreement based Cluster Head Failure Detection and Election Protocol for a WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c7dd5f68-53ee-54fb-8047-c38bea3cc605', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mukesh Jha', '', 'Efficient and Secure Data Aggregation Protocol for a WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c3cba0f7-95cc-55e3-b4b9-805b6939d163', '22222222-2222-2222-2222-222222222222', 'MTech', 'T. Roopesh', '', 'Energy Efficient Routing Using Query and Event Flooding in WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('a1efb02a-acf0-5714-a233-12f079700a3f', '22222222-2222-2222-2222-222222222222', 'MTech', 'Gopal Chand Gautam', '', 'Energy efficient Time Synchronization Protocol for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b593356e-3720-5073-b607-69c158272555', '22222222-2222-2222-2222-222222222222', 'MTech', 'Urvashi Rao', '', 'Improving Quality of Service of Live Peer-to-Peer Live Video Streaming', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6dee2042-dceb-50c9-9995-59a66df9dc42', '22222222-2222-2222-2222-222222222222', 'MTech', 'Pratap Singh', '', 'Geographically Aware Virtual Grid for Wireless Sensor networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('643386a7-7f72-5085-8ae8-ed5592145c1e', '22222222-2222-2222-2222-222222222222', 'MTech', 'Anuj Yadav', '', 'In-Network Data Management for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b23df8c7-968f-53aa-878f-9d342cbf7c68', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vikram Singh', '', 'Fault Tolerant Time Synchronization for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2a994499-70e3-5e47-bf1b-82acf21cde4d', '22222222-2222-2222-2222-222222222222', 'MTech', 'Satyender Jumar Sharma', '', 'Redeployment of Mobile Sensor Nodes in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0b9cfa9d-5ffb-5b43-a926-f084d1045cfd', '22222222-2222-2222-2222-222222222222', 'MTech', 'T. Priyanka', '', 'A Clustering Algorithm for Stable Cluster Formation in Vehicular Area Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('bd78a7f5-78e6-5675-8087-fd82360b6268', '22222222-2222-2222-2222-222222222222', 'MTech', 'Krishna Joshi', '', 'Topology Management in WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('4f5be7ac-874e-5272-9517-1885b16541bf', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhiram Singh', '', 'Full Coverage Control in WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('491193ed-21c0-5017-84b9-476be01128e5', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vishakha Dhiman', '', 'Fault Tolerance in WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7a996222-eac0-55b9-8bb0-420c6160ea55', '22222222-2222-2222-2222-222222222222', 'MTech', 'Varsha Chaudhary', '', 'Collecting Global State in WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5c198c02-a647-5e28-999a-60dfea608d66', '22222222-2222-2222-2222-222222222222', 'MTech', 'Pankaj Kumar', '', 'Energy Aware Recovery from Network Partitioning in WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1efef595-981d-5bf9-8c7c-66a39a414530', '22222222-2222-2222-2222-222222222222', 'MTech', 'Bheri Srihari', '', 'Performance Improvement in Web Caching along with prefetching', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3514fa96-82a3-5e83-97c0-31b0399fc052', '22222222-2222-2222-2222-222222222222', 'MTech', 'Pankaj Azad', '', 'Energy Efficient Distributed Global Snapshot Algorithm for WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5000c422-bcdc-50ba-83dd-37cdde344ba8', '22222222-2222-2222-2222-222222222222', 'MTech', 'Nancy', '', 'Fault Tolerant Time Synchronization Protocol for WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5f8f1e3b-c879-54d8-9a98-74660edf6075', '22222222-2222-2222-2222-222222222222', 'MTech', 'Surbhi Sharma', '', 'Global Snapshot for Large WSNs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('02c21b9b-47eb-530d-b2eb-f908c8afea28', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kamal Singh', '', 'Finding Location of Wireless Sensor Nodes without using GPS', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('dcdebfe1-3e7c-5d3e-a16d-0e7c17d7821c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shivangi Gupta', '', 'Parameter Based Cooperative Caching for WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('d3311947-f29a-55ec-b036-7b40ff04b3e0', '22222222-2222-2222-2222-222222222222', 'PhD', 'Rajiv Singh', '', 'Enhancing Security in Wireless Local Area Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('30f7be14-0ca0-5c03-bfad-0a49eee4a4e5', '22222222-2222-2222-2222-222222222222', 'PhD', 'Krishan Pal Sharma', '', 'Minimizing Network Partitioning and Improving Data Availability in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2ab82eaa-f266-5f06-9e32-00a38c469d77', '22222222-2222-2222-2222-222222222222', 'PhD', 'Kulwardhan Singh', '', 'Optimizing Route Discovery and Handling Mobility in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('093c7b16-ebf7-51fb-b1b9-3cc6da70e6df', '22222222-2222-2222-2222-222222222222', 'PhD', 'Vipan Arora', '', 'Reducing Inter-node Transmissions in a Wireless Sensor Network using Dynamic Sensing and Cooperative Caching', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7b08331b-ff5f-57d0-b527-6081bb7bd45d', '22222222-2222-2222-2222-222222222222', 'PhD', 'Richa', '', 'Improving Connectivity and Data Availability in VANETs', 'Completed', 'Prof. Ajay Sharma')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ca920083-43dd-5715-a449-3f8430d1fbde', '22222222-2222-2222-2222-222222222222', 'PhD', 'Mohammad Ahsan', '', 'Sentiment Based Information Diffusion in Online Social Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c77c106a-fac4-5d61-8875-1e0f102e7f46', '22222222-2222-2222-2222-222222222222', 'MTech', 'Pranit Verma', '22MCS112', 'ADeepLearning Based Hybrid Structure for the Intrusion Detection', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c95ef63a-1aad-5822-9dd1-3b4670fa1854', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ashish Kundal', '22MCS014', 'Detection of Plant Diseases in Hydroponics Farming Using Deep Learning Techniques', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('d263d4f9-ed35-5647-955d-ab76baf4afca', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aleena Ariz', '22MCS003', 'Energy Optimization in Wireless Body Sensor Networks using Hybrid WOA-BAT Algorithm', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('56a560a0-bad8-5ded-a6b4-be012fbc34e9', '22222222-2222-2222-2222-222222222222', 'MTech', 'Malika Sood', '195562', 'Revolutionizing Tomato Agriculture: Leaf Disease Detection using CNN and its Variants', 'Completed', 'Dr. Jyoti Srivastava')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('deaf8753-6f28-54dc-9347-7f988969b04c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ajay Kumar', '22MCS019', 'Enhancing Hindi Named Entity Recognition using XLM-RoBERTa', 'Completed', 'Dr. Jyoti Srivastava')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ba174466-5ca8-58f6-ac52-a699efc07c40', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sakshi', '22MCS113', 'Deep Learning Based Watermarking for Electronic Health Records', 'Completed', 'Dr. Mohit Kumar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c071f39e-ef0b-5f61-98db-74351f853992', '22222222-2222-2222-2222-222222222222', 'MTech', 'Nidhi Singh', '22MCS109', 'Fine-Grained Birds Classification', 'Completed', 'Dr. Mohit Kumar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('db743c70-9d67-5822-8981-fd65ca14ead1', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sourabh Sharma', '23MCS021', 'Deep Convolutional Networks and Handcrafted Multi-Feature Fusion based Image Retrieval', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('379d14f0-a592-554d-87f8-706b5dea1f4a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Atul Sharma', '23MCS109', 'Attention-Based Deep Learning Approach for Fingerprint Liveness Detection', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('96d61258-e1d9-58cf-912e-7642a2299dd3', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sameer Mirza', '23MCS120', 'Enhanced Small Object Detection in Aerial Imagery using Deep Cross Block and YOLOv9 Fusion', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3024dede-8a28-5861-bce2-3c3c5911d2d8', '22222222-2222-2222-2222-222222222222', 'PhD', 'Shorav Verma', '25RCS010', 'Development of Deep learning Approach for Image Enhancement in Adverse Visual Conditions', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('d6e3baec-7c8d-5da3-ae63-3c8d26bfa95c', '22222222-2222-2222-2222-222222222222', 'PhD', 'Pranit Verma', '25RCS002', 'Dissertation Thesis', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('528d3c8d-9eb1-5373-b5d5-ad554ffc6cb4', '22222222-2222-2222-2222-222222222222', 'PhD', 'Nishant Sharma', '', 'Improving Data Availability in Internet of Vehicles Environment', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('810c1dba-1457-5d2b-b4b0-cef54cd569cb', '22222222-2222-2222-2222-222222222222', 'PhD', 'Himanshu Verma', '', 'Internet of Healthcare Things', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('31caf28f-c1ed-503c-908c-bc9600593cea', '22222222-2222-2222-2222-222222222222', 'PhD', 'Rangu Manjula', '20RCS005', 'Blockchain in Agriculture Supply Management', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c75cf0b8-8eca-544b-97fe-c9eb0d5d5b52', '22222222-2222-2222-2222-222222222222', 'PhD', 'Md. Ataullah', '23RCS001', 'Security and Privacy in IoT', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('40941ac8-a954-5066-8d21-d617c63bfdeb', '22222222-2222-2222-2222-222222222222', 'PhD', 'Subeesh. A', '23RCS003', 'Machine Learning and IoT in agriculture', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('388ba8f0-fffc-5798-93e1-ef05e0b68265', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mahima Dubey', '19M515', 'Energy Conservation Optimal Path Algorithm in Wireless Body Area Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('e9f2db14-20f7-56ee-9f4d-a02178c4c76c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Saurabh Katoch', '19M505', 'Using Genetic Algorithms for Deployment of Electric Vehicle Charging Stations', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7302ee7e-8cd4-59ae-bd1f-7d8b4cfbe643', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rakesh Arya', '19M512', 'Junction cross link removal in Vehicular Adhoc Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('f42fae19-e743-5c9e-8027-3a9688c95f46', '22222222-2222-2222-2222-222222222222', 'MTech', 'Prashant Kumar', '20MCS008', 'Intelligent Traffic Management for High-Priority Vehicles', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('65a313f7-5e77-5e3c-b147-068cbe2a9c20', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mahesh Rajendra Shirsath', '20MCS006', 'A Novel Deep Neural Network based Classification of Arrhythmia', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('13356398-c56d-5ef9-969b-2fc10e335fe3', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vineet Sharma', '17MI514', 'Real-Time Decision Making Preemptive Service Based CS Recommendation and Reservation System For Electric Vehicles', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2f8b27c9-2b95-5a66-aa37-2cb1d92bd7b9', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aakanksha', '17MI549', 'Efficient Workflow Scheduling in Cloud Computing using Hybrid Algorithm', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7442a2f7-19da-5111-bd28-f613ee840b2e', '22222222-2222-2222-2222-222222222222', 'MTech', 'Namisha', '17MI550', 'Workflow Scheduling by Multi Objective Genetic Approach with Ranking of Task in Cloud Environment', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('9155b4c2-2a1f-5b21-82b2-ff1161ba7dab', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sourav Kumar Tanwar', '21MCS013', 'Automated classification of Fatal Ultrasound Images with Hybrid Capsule Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1fb0f286-4558-585c-a2e0-74e4abd17966', '22222222-2222-2222-2222-222222222222', 'MTech', 'Yogesh Nimalkar', '21MCS015', 'Exploring the efficacy of NLP and Deep learning Technique for depression detection', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('f71ff787-9a82-519c-8cdf-0dc9b51229ad', '22222222-2222-2222-2222-222222222222', 'MTech', 'Gudala Laya', '185557', 'Efficient WBAN Routing by MultiObjective Optimization Genetic Algorithm', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('abac2236-7548-51a0-9078-0f8ce3db7993', '22222222-2222-2222-2222-222222222222', 'MTech', 'Nakshatra Goyal', '185531', 'Content Based Image retrieval for Retinal images using SIFT', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('e613fd43-17e8-5359-99ea-467b2aa0f0d2', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ankush', '185508', 'Skin cancer detection using deep learning approach', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0da4c787-2a59-56f9-a2de-3e81197ad3e9', '22222222-2222-2222-2222-222222222222', 'PhD', 'Praveen Prakash', '23RCS004', 'Lightweight Security Model of Internet of Things System (Tentative)', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('41d8c9c0-a03a-5901-a22c-0f3d7a4bd739', '22222222-2222-2222-2222-222222222222', 'PhD', 'Azmeera Chandu Naik', '21RCS006', 'Development of a Trust Aware Secure Routing Strategy for the Internet of Things (IOT) Network', 'Ongoing', 'Dr. Priyanka')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3ceaa03b-69ef-5937-8e84-a73181f23b1c', '22222222-2222-2222-2222-222222222222', 'PhD', 'Sourav Mondal', '21RCS005', 'Brain Stroke Prediction using Machine Learning', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6476e4ec-bb50-5edb-98d1-d0f215fb6ea1', '22222222-2222-2222-2222-222222222222', 'MTech', 'Harsh Seth', '185560', 'Augmentation of Medical Image dataset using GAN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('782250e6-0ed0-5cb3-a86a-7800865701e4', '22222222-2222-2222-2222-222222222222', 'MTech', 'Karan Bharadwaj', '185544', 'Routing scheduling for Drone Delivery System using Deep Reinforcement learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('84c07294-93dd-522f-8c77-7ebfad2d6349', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kritarth Kapoor', '185510', 'Bell-pepper leaf bacterial spot detection using Deep Learning approach', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('592f64d9-996b-54c4-a44e-ac33a5fc1fa6', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhishek Kapoor', '22MCS012', 'Energy Efficient Cluster Head Replacement algorithm in Wireless sensor networks', 'Completed', 'Dr. Robin Singh Bhadoria')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('063b6fe7-1c4b-580e-a425-0c15e5de60d5', '22222222-2222-2222-2222-222222222222', 'MTech', 'Anshul', '22MCS005', 'Relay Node placement in wireless body area Network using Ant colony Optimization with Game Theory', 'Completed', 'Dr. Robin Singh Bhadoria')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('9a947d18-692b-5d3b-992c-bac52f661e56', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kishan Kumar', '195568', 'BERT- based Meta-Stacked Ensemble Learning in Sentiment analysis and Prediction', 'Completed', 'Dr. Robin Singh Bhadoria')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('704e0507-7b23-57b3-b436-93b63e0c5799', '22222222-2222-2222-2222-222222222222', 'PhD', 'Ishana Attri', '21 RCS004', 'Deep Learning based Framework for Early Detection of Diseases in Seasonal Crops', 'Ongoing', 'Dr. Teek Parval Sharma')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2abf53b2-0f17-54ea-b780-a0ed40d1bc0c', '22222222-2222-2222-2222-222222222222', 'PhD', 'Rajesh Sharma', '', 'Energy Efficient Data Dissemination in WSNs', 'Completed', 'Dr. Narottam Chand')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fb7b14df-5df7-5a38-9aab-9f424b179b0f', '22222222-2222-2222-2222-222222222222', 'PhD', 'Jawahar Thakur', '', 'Devising Checkpointing Protocol For Wireless Adhoc Networks', 'Completed', 'Dr. Arvind Kalia')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('96127953-b87f-5889-9cc8-94917b48ebbf', '22222222-2222-2222-2222-222222222222', 'MTech', 'Arpita Naval', '', 'Image Steganography using Discrete Wavelet Transform', 'Completed', 'Dr. Priyanka')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2b4ecc20-495f-5fcf-9cd8-3eec087e806a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kishan Kumar', '', 'Feature Based Sentiment Analysis Using Stacked Meta- Ensemble Learner', 'Completed', 'Dr. Priyanka')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0d1d3c3f-e575-5635-a03b-6a146abd65ba', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhijeet Gupta', '', 'Face Recognition Captcha', 'Completed', 'Dr. Priyanka')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0da3f02e-7ea7-5f36-8127-b088af5b6b51', '22222222-2222-2222-2222-222222222222', 'MTech', 'Anshul Kumar', '', 'Combining Ant colony optimization with game theory for optimal placement of relay nodes in WBAN', 'Completed', 'Dr. Priyanka')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('150342c1-1541-53e5-b2d9-e6a7e5ff9d18', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhishek Kapoor', '', 'Enhancing Energy Efficiency in IoT Networks', 'Completed', 'Dr. Priyanka')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7640c765-a38c-56f2-ab11-2055173b9569', '22222222-2222-2222-2222-222222222222', 'MTech', 'Judhister Mahapatro', '', 'Energy Efficient Base Station- Assisted Cluster Based Approach to routing in wireless sensor networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('a5b9f9b4-325d-53ca-85ca-5f58f845ac9c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rakesh singh Sambyal', '', 'QOS-Aware Model for Wimax', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3d857e5a-4aa4-5afe-8dee-0946cd06d217', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sahabul Alam', '', 'A Spanning Tree Based Energy Efficient K-Means Clustering Approach in Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('12836bb1-f89e-5c94-a775-ce5d37a6d244', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shiv Shakti Shrivastava', '', 'A model of Cryptographic System Optimizing the Playfair Cipher', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('deba2c03-75a6-5cb1-af6a-0516f53828aa', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kiran Maraiya', '', 'Efficient Cluster Head Selection Scheme for Data Aggregation in Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('94c5710f-befa-56e7-af2a-0d0c3a5b44da', '22222222-2222-2222-2222-222222222222', 'MTech', 'Raj Kumar', '', 'Enhanced, Efficient and novel access control in WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('82263d75-ba7f-5a2b-b03d-a9a17030ac2c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ankur Srivastava', '', 'Localization in WSN using Angle of signal propagation.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0473ad58-ee7f-5ba9-ad34-39a7c76c2906', '22222222-2222-2222-2222-222222222222', 'MTech', 'Uttam Vijay', '', 'Minimum Spanning Tree Based Clustering in wireless sensor network using Divide and Conquer Approach.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('db17f9a9-ccc6-55c7-84af-0db4c0e21c92', '22222222-2222-2222-2222-222222222222', 'MTech', 'Neelam', '', 'Optimal cache placement by identifying potential congestion nodes in WSN.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('54de1661-916f-52fb-b399-df592a7f6432', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rajiv Kumar V', '', 'Heterogeneous computing with GPGPU for time complexity reduction in DALI structure alignment.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('206c338e-e9b2-5c54-a58b-acbe1850def9', '22222222-2222-2222-2222-222222222222', 'MTech', 'Harpreet Kaur', '', 'Localized algorithm for channel assignment in Cognitive Radio Networks.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3111201c-0ba5-5475-9152-663041c41468', '22222222-2222-2222-2222-222222222222', 'MTech', 'Parveen Kumar', '', 'Algorithm for Steiner Tree Problem Using Fixed Dimension Grid Topology', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('a9d5bd5a-c8a6-5978-8454-42e00c2ded29', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhishek Kumar', '', 'Malicious Nodes Detection in CRN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ee0c54b6-b87b-55e8-8e2f-fb89e5ecae42', '22222222-2222-2222-2222-222222222222', 'MTech', 'Danish Pachyala', '', 'Cournot Game Based Power Allocation Scheme for CRN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c73ba8f3-a7c8-5666-9f03-9d4189621a49', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shreya Shrivastav', '', 'Target Channel Selection for Spectrum Handoff in CRN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2357f9d7-6e0b-58df-a149-e3e152a67571', '22222222-2222-2222-2222-222222222222', 'MTech', 'Arun K Sharma', '', 'Hypergraph Theory Based Channel Assignment in CRN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c2d70dfb-2150-5fad-b5ee-451623efa00d', '22222222-2222-2222-2222-222222222222', 'MTech', 'Pranav Solanki', '', 'A Clustering Scheme for Cognitive Radio Networks Based Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b373d9e2-3911-572c-891f-e8c2a550d71a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mohammad Aziz', '', 'Efficient clustering Scheme in CRNWSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('85276ec8-7cbf-519c-81d9-ed5a673cbf87', '22222222-2222-2222-2222-222222222222', 'MTech', 'Archit Jain', '', 'Permissioned Blockchain-Based Incentive Distribution Scheme for Cooperative Sensing in CRN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('786d2fd8-924b-5c3f-b8fb-e8c485aedfab', '22222222-2222-2222-2222-222222222222', 'MTech', 'Riya', '', 'Efficient Caching Method in Fog Computing for Internet of Things Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('90be793c-b89e-57b8-b7ea-dec96b01d458', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sushant Sharma', '', 'Federated Learning Based Caching Scheme for Fog Computing', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('89c99ef0-3671-5592-822c-8fd03e7abb5e', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mohit Patyal', '', 'Optimal Cache Placement using Gradient Descent method in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('582d92c6-cd6f-5af8-a9a5-b7c81fc63f26', '22222222-2222-2222-2222-222222222222', 'MTech', 'Akshita Doad', '', 'Profit Enhancing Resource Allocation in Fog Computing', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('8925a26c-c0a6-5bf8-b81e-92c5873dd379', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kartik Saxena', '', 'Drone Trajectory Optimization for Data Collection in WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('835d9fb9-c614-5554-82bd-3d6f3e4212bf', '22222222-2222-2222-2222-222222222222', 'MTech', 'Robin Singh Rana', '', 'Effective Task Scheduling in Cloud Environment', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('e7abe105-6510-506e-9162-e231b7205ba1', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shruti Meshram', '', 'Data Analytics Based Caching for Fog Computing', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c3e0d965-17ba-53e1-a90a-3a93ee47a1cd', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ankit Gunavat', '', 'Comparative Study of Task Scheduling Algorithms for Cloud Computing', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('660c12be-d75f-5c90-b764-99787d4ee3a9', '22222222-2222-2222-2222-222222222222', 'MTech', 'Jahnvi Gupta', '', 'An IoT and Deep Learning based Aid for Monitoring Hallucinations and Assisting in Cognitive Rehabilitation of Schizophrenia Patients', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('da93bfcd-2c8f-530f-81be-ad7580536999', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mukesh Kumar', '', 'T-AES and ECC Based Secure Data Communication in Peer to Peer networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('f45f0400-d89a-5cc1-979e-e9b7d6652147', '22222222-2222-2222-2222-222222222222', 'MTech', 'Saikat Datta', '', 'Tea Leaf Disease Detection and Classification Using Deep Neural Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3d2f73c3-3a0b-503d-ba0f-5b8b9304364c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kharanshu Sharma', '', 'Auto Text Generation using Recurrent Neural Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('8d4972af-e4b3-50c0-b606-4fde36633071', '22222222-2222-2222-2222-222222222222', 'MTech', 'Gollamandala Sanjay', '', 'Bayesian Optimization and Neural Network Based Opportunistic Routing in WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b2b7c593-482e-571f-a53d-64c93c9dd0de', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ritwik Duggal', '', 'Contactless Biometric Verification using Recognition and Detection of Bracelet Lines', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1810bdbf-1a02-55b6-8033-40dda1064770', '22222222-2222-2222-2222-222222222222', 'MTech', 'Moulik', '', 'Privacy Aware Routing in Opportunistic Networks with Federated Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('eb429691-151a-5571-a068-bad31ea67324', '22222222-2222-2222-2222-222222222222', 'MTech', 'Himanshi', '', 'Design and Implementation of a Refreshable Braille Display Watch for Enhancing Multilingual Communication Between Deaf-Blind Individuals and the General Population', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('e22872a2-bbd6-5a40-ac03-d73e0dc1f104', '22222222-2222-2222-2222-222222222222', 'MTech', 'Akshay Thakur', '', 'Multidimensional Community Correlation Based Routing for Data Transmission in VANETs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('afdc183b-0d97-5fe4-8694-ad8746e7cd0d', '22222222-2222-2222-2222-222222222222', 'PhD', 'M. Sreenu Maloth', '', 'Blockchain for efficient Vaccine Distribution', 'Completed', 'Dr. Chandrashekar Jatoth, NIT Raipur')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('58896e67-d340-5e03-bba2-87058a7e7a62', '22222222-2222-2222-2222-222222222222', 'PhD', 'Kuldeep Singh Jadon', '', 'IoT for Sustainable Computing', 'Ongoing', 'Prof. Lalit Awasthi, VC, SPU Mandi (H.P)')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('cf174aab-6835-5f32-8286-9bc130d6da58', '22222222-2222-2222-2222-222222222222', 'PhD', 'Smriti Guleria', '', 'Edge Computing', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('cbf7235b-09bd-5210-9402-b03d2af67258', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vaishali Thakur', '21DCS021', 'Reinforcement Technique for Image Enhancement', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('01dce3f7-c80a-5a51-8fbe-6dfeaaff6454', '22222222-2222-2222-2222-222222222222', 'MTech', 'Tanmay Patel', '22DCS001', 'Techniques to Solve Data Imbalance problems for medical Images', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6af28643-4df1-525d-bf66-c7322513913f', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhishek Badwaik', '24MCS101', 'Challenges for robotics Vision', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2211f008-67da-5ec1-8216-2751cd9f7146', '22222222-2222-2222-2222-222222222222', 'MTech', 'Archish', '24MCS106', 'Deep Supervised Image Enhancement Approaches', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('80edf5cb-a09d-510d-aeb8-7ba5060e38b2', '22222222-2222-2222-2222-222222222222', 'MTech', 'Deepanshu', '24MCS016', 'Deep Semantic Learning Approaches for Content based Image Retrieval', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('e0a836e8-86b6-543a-89e0-aa36e2e516b5', '22222222-2222-2222-2222-222222222222', 'PhD', 'Geetanjali', '22RCS002', 'Hate Speech Detection in Hindi Language', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('8f9af32f-5e53-5d6e-a1a7-2c52a1bd8415', '22222222-2222-2222-2222-222222222222', 'PhD', 'Ranjeet Chaudhary', '24RCS002', 'Cyberbullying detection in low resource languages', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7b8429ad-8055-52ee-ac98-4334379ee0e3', '22222222-2222-2222-2222-222222222222', 'PhD', 'Neha Sharma', '24RCS014', 'Sentiment analysis for low resource languages', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3135b2f1-5f62-5f5c-acdb-3647afa327d9', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ankan Mondal', '23MCS015', 'Fingerprint Template Protection using Post-Quantum Cryptography', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('782efcba-129b-524c-8f3a-5950dc2bd062', '22222222-2222-2222-2222-222222222222', 'MTech', 'Balram Singh', '23MCS104', 'An Explainable Deep Learning Framework for Plant Leaf Disease Detection', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5077a2f4-8897-5aed-8e71-badbe1107498', '22222222-2222-2222-2222-222222222222', 'MTech', 'Tanuj', '23MCS116', 'Contactless Fingerprint Presentation Attack Detection', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c744e7db-b529-5a84-bb03-625c7a1e18c1', '22222222-2222-2222-2222-222222222222', 'PhD', 'Ashutosh Sharma', '25RCS001', 'Explainable and Generative AI in Biometric Security', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('833e7931-2f9d-548f-99fc-2e20d4dbe953', '22222222-2222-2222-2222-222222222222', 'MTech', 'Anant Verma', '195544', 'Cyberbullying Detection in Hindi Text Using Multimodal Deep Learning Approach.', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5ab5edd6-8285-5b47-a8d6-6175e2b7debb', '22222222-2222-2222-2222-222222222222', 'PhD', 'Arvind Dhaka', '15RCS295', 'Characterization and Statistical Optimization of Fading Impairments in a MIMO Channel', 'Completed', 'Dr. vidhyacharan Bhaskar')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1e15cda6-95dc-5ea1-a090-b52ba9f27084', '22222222-2222-2222-2222-222222222222', 'PhD', 'Shashi Gurung', '14RCS274', 'Security in Wireless Mobile Ad Hoc Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('70f62b1d-ce36-5d4d-a4a6-6dd86bb8df82', '22222222-2222-2222-2222-222222222222', 'PhD', 'Deepshikha', '14RCS265', 'Body Area Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('82824b46-fec3-5bdf-ab05-62a5b1786ad1', '22222222-2222-2222-2222-222222222222', 'PhD', 'Anamika Sharma', '14RCS264', 'Surveillance Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2fa7ffd4-e6c8-57a1-a542-17719c0bb2ec', '22222222-2222-2222-2222-222222222222', 'PhD', 'Nilanshi Chauhan', '17RCS361', 'Energy Efficient Protocols in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('689acb6f-a8b8-5af9-8253-187c9cfb9028', '22222222-2222-2222-2222-222222222222', 'PhD', 'Piyush Rawat', '18RCS398', 'Lifetime Enhancement of Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c29df506-5408-5783-8d51-8ec41170c846', '22222222-2222-2222-2222-222222222222', 'PhD', 'Pranjal', '19RCS468', 'IOT', 'Completed', 'Prof Lalit Kumar Awasthi')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7d52f628-5ae9-52ff-b99a-c5d2a29f82af', '22222222-2222-2222-2222-222222222222', 'PhD', 'Abhishek Sharma', '25RCS009', 'Cyber attack detection and presvention mechanism for secure internet use', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('3e6b6e73-b2bd-532d-aff7-1139f0127e50', '22222222-2222-2222-2222-222222222222', 'MTech', 'Varsha Katre', '16M527', 'Cluster Head Failure Detection and Correction Algorithm for WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1759c6da-e4da-52bc-9ffe-7e83a88798fd', '22222222-2222-2222-2222-222222222222', 'MTech', 'Piyush Rawat', '16M512', 'An Energy Efficient Random Number Clustering in Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('264ed562-25a2-5ee7-9870-ba465fd87779', '22222222-2222-2222-2222-222222222222', 'MTech', 'Supriya Shakya', '15M526', 'Utility Based Cluster Head Selection Protocol for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('bfa642e7-25b7-51f5-844d-0569c3ddc4ba', '22222222-2222-2222-2222-222222222222', 'MTech', 'Himani Sikarwar', '15M531', 'Decision Algorithm for Faulty Node Identification', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1dc9fd70-ec3c-5f51-af84-e8907718e7dd', '22222222-2222-2222-2222-222222222222', 'MTech', 'Amit Tiwari', '14M513', 'Sinkhole Intrusion Detection in wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b593bdc0-219e-5c37-b875-33d5c1acd335', '22222222-2222-2222-2222-222222222222', 'MTech', 'Prashant Wankhede', '14M507', 'Adaptive Probabilistic Routing Algorithm for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('400ea982-2e5f-5909-b6f4-b362e7bbae4a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Obulapu Hitesh Reddy', '14M526', 'Energy Efficient Cluster Based Routing Protocol for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6ad147f3-ee9b-5723-bd51-ce1911d9f49c', '22222222-2222-2222-2222-222222222222', 'MTech', 'Amit Kumar', '14M511', 'Energy-Efficient Private Data Aggregation in wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('b791029d-7a90-5b2c-abda-e43930de9617', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shiv Kumar', '13M531', 'Distributed Clustering Protocol for Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('4b0a7e88-b8c8-5fc8-9fef-f18275503dee', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ashsih', '13M539', 'Multilevel Clustering based Time Synchronization Protocol for Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('6e5bfe44-cf4b-52f4-b47b-f4df6d6a419f', '22222222-2222-2222-2222-222222222222', 'MTech', 'Arpit Gupta', '13M532', 'Distributed Range Based Localization in Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ac20094f-a1eb-5796-914f-25d773297390', '22222222-2222-2222-2222-222222222222', 'MTech', 'Pushpendra Bansal', '13M514', 'Confidentiality in Cloud Computing', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('9a2e8c4d-5364-5228-a251-aa55549dc336', '22222222-2222-2222-2222-222222222222', 'MTech', 'Nitin Kumar Kotania', '12M527', 'Location Based Clustering: An Energy Efficient Location Based Clustering Data Gathering Scheme for Heterogeneous WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ce2c7776-b5a9-5b4a-9730-0dd50ef417e5', '22222222-2222-2222-2222-222222222222', 'MTech', 'Monica Rathee', '12M509', 'Forest Fire Detection & Monitoring Frame Work: Using Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fd8df06b-81fd-5418-8f28-a8e0be95477d', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ishwar Chand', '10M529', 'Optimum minimum separation distance based clustering in wireless sensor networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('352e83cc-7f88-5e87-95ec-4ab2557a8a2b', '22222222-2222-2222-2222-222222222222', 'MTech', 'Mukul Jain', '21MCS017', 'Design And Evaluation For Session Based Recommendation For Improvised TAGNN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5f642dc4-8331-5542-a5ac-835250eb3598', '22222222-2222-2222-2222-222222222222', 'MTech', 'Abhinav', '21MCS027', 'SENTIMENT ANALYSIS OF TWITTER TEXT', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('58a79d15-0944-5bd7-b4e4-4992af22a144', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ritesh Kumar', '21MCS009', 'PERFORMANCE ANALYSIS OF SQL VS NOSQL DATABASES FOR MICROSERVICE', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2c8912fe-ec1f-5d22-9dd9-862da585396f', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kashish Kumar', '185538', 'HATE SPEECH DETECTION IN ENGLISH MEMES', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5d06fc16-292b-5d78-9934-aa201db98a61', '22222222-2222-2222-2222-222222222222', 'MTech', 'Virendra Khorwal', '195552', 'BLOCKCHAIN-BASED OFFLOADING OPTIMIZATION AND TASK PARTITIONING IN JOINT COVERAGE SCENARIOS WITH MULTIPLE VECs', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('480bcfd7-f9bb-5848-a345-852390b13ead', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aashish', '195529', 'PLANT DISEASE CLASSIFICATION USING DEEP LEARNING', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ea4038b8-8560-53df-80cd-009fb3c6975a', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kailash Rana', '195525', 'IDENTIFICATION OF PNEUMONIA IN CHEST X-RAYS VIA TRANSFER LEARNING', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('8a31c7a1-b18b-522d-bc3c-2d796d58c268', '22222222-2222-2222-2222-222222222222', 'MTech', 'Deepanshu Sharma', '195520', 'HEART DISEASE PREDICTION WITH DATA MINING CLASSIFICATION ALGORITHMS', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('1dacaed2-ad14-5e55-85a3-c858c3f5317d', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shama Devi', '195518', 'Enhanced Alzheimer''s Disease Progression Prediction via Combined MRI and PET Imaging with 3D CNN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('43f8253d-ffac-59f2-ab82-9f314c788dea', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shorya Rajput', '195561', 'Understanding and Reducing Hallucinations in Neural Machine Translation', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('7708cdce-085a-5c8b-9729-370083765e40', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vasvi Sharma', '22MCS001', 'WEB Bot Detection Using Keyboard Behavioural Analysis', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('2c163266-a686-57f1-be26-dc668070a982', '22222222-2222-2222-2222-222222222222', 'MTech', 'Akhil Sharma', '22MCS008', 'HEAT : A Hybridized Methodology to Augment Explainability in Brain Tumor Detection using Deep Learning Technique', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('0f480080-a405-55cb-b90c-135047538705', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aryan Pal Singh', '22MCS004', 'Smart Wearable for Quick Identification of Cardiac Arrest', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('584fd5ea-9a20-53b5-ab99-17285017de40', '22222222-2222-2222-2222-222222222222', 'PhD', 'Aschalew Tirulo Abiko', '21RCS002', 'Detection and Mitigation of Cyberattacks in IOT-Enabled Smart Grids', 'Ongoing', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fbe01c62-d841-5b0c-aa77-851a3e665c9d', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ashutosh Sharma', '23MCS114', 'Melanoma Detection Using an Ensemble Model of EfficientNet and vision Transformer with GLCM for feature Extraction', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('30091590-bbb8-5075-b9ca-83769b80f5de', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aman Gupta', '23MCS004', 'Scalability and Performance Optimization of Graph Attention Networks for Large-Scale Graph Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('902596c7-003c-5967-bf21-6756bda2da71', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aman Sharma', '23MCS018', 'A Cross-lingual Neural Pipeline for Multilingual Aspect-Based Sentiment Analysis Quadruple Extraction', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('a2beb102-7f87-5318-b937-3ed2a6e8ffe1', '22222222-2222-2222-2222-222222222222', 'MTech', 'Milindra Pratap Singh', '14MI533', 'Distributed Security in Wireless Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('30c5a1ba-cfdc-5655-8bf4-bbeef823a4fc', '22222222-2222-2222-2222-222222222222', 'MTech', 'Ishita Parmar', '14MI505', 'Energy-Efficient Self-Decisive Clustering Based Routing Protocol For WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('8535db44-eb22-5b4a-8fd9-2a233af317aa', '22222222-2222-2222-2222-222222222222', 'MTech', 'Shweta Arya', '20MCS014', 'Lung Cancer Detection using Image Processing', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5c66754d-3bfe-5291-a3bc-bc58b44fd617', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aditya Thakur', '14MI521', 'An Energy Efficient Time Synchronization Protocol For Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('261088e7-2b2a-529a-8cea-c0ffa0509f03', '22222222-2222-2222-2222-222222222222', 'MTech', 'Aarti Ramoul', '14MI547', 'A Data Aggregation Algorithm For Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('246f0441-98cd-57f7-9815-84e596e3e4a3', '22222222-2222-2222-2222-222222222222', 'MTech', 'Vedant Khachi', '14MI527', 'Mitigation of The Effects Of The Grey Hole Attack In MANET Using Artificial Technique', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('9a361f13-28b8-53af-b577-998103c16a48', '22222222-2222-2222-2222-222222222222', 'MTech', 'Juri Kalita', '17M529', 'An Energy Efficient Routing Protocol for Heterogeneous WSN', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('88ff6bce-643b-5a18-8b5c-b5d9edaa0659', '22222222-2222-2222-2222-222222222222', 'MTech', 'Saurabh Kumar', '14MI539', 'Selfish Node Detection in MANETs using a Bayesian Game Model', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('31da3c3a-5548-56f6-840b-3cf8a490dabd', '22222222-2222-2222-2222-222222222222', 'MTech', 'Sherish Saxena', '14MI523', 'Facial Emotion Recognition using Deep Learning', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('66ee9ffc-ed24-5a6b-b4e7-6949f235a1fb', '22222222-2222-2222-2222-222222222222', 'MTech', 'Piyush Dangayach', '17MI527', 'Intrusion Classification And Detection Using Deep Learning For IOT', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('afa02b82-7a9d-5317-b9a2-b1ecd955e5fb', '22222222-2222-2222-2222-222222222222', 'MTech', 'Komal Negi', '17MI530', 'Energy Aware WSN Deployed using Hierarchical Routing Protocol', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('bbeb38ff-17f7-5578-afbb-e5bfaf680fd1', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rohit Hill', '17MI526', 'VGT: A Load Balancing Algorithm using Virtual Grid Technique for Mobile Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('5218bb6a-e6e7-57f2-b82e-e08c789ad037', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rachana Umaraniya', '20MCS009', 'Energy Conservation In Smart Agriculture using Caching in FOG Framework', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('950e572f-855b-5b00-866b-01b56fb2c693', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kuldeep Goswami', '08M516', 'A Protocol To Reduce Energy Consumption in Transmission and Reception of Temporally Correlated Data of A Sensor Node In Sensor Network', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('a0dfea27-cabf-5efd-96b1-82aafff6a958', '22222222-2222-2222-2222-222222222222', 'MTech', 'Prateek Gupta', '09M511', 'Event And Query Based Data Dissemination Protocol for Wireless Sensor Networks', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('c57deb86-0322-5699-b411-5f7a5cfe367b', '22222222-2222-2222-2222-222222222222', 'MTech', 'Manthan Jain', '20DCS003', 'Enhancing Packet Delivery in Underwater Wireless Sensor Networks Using spare semi-oblivious routing and particle swarm optimization', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('abd7c323-9566-520c-871b-779c714ea505', '22222222-2222-2222-2222-222222222222', 'MTech', 'Kinshuk Sharely', '20DCS024', 'Enhanced Energy Optimization in Underwater Wireless Sensor Networks Using Honey Bee and Genetic Algorithm', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('170bcdc3-d0db-5e8c-84c4-2e548ffd7e33', '22222222-2222-2222-2222-222222222222', 'PhD', 'Tanuj', '2K17-Ph.D.-CSE-338', 'Efficient Handling of Big Data in lnternet of Things', 'Completed', 'Dr Ajay Kumar Sharma')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fdf11fd3-cadb-5c02-abfb-791d139b9a2c', '22222222-2222-2222-2222-222222222222', 'PhD', 'Deepa Rani', '21RCS003', 'Energy Efficient and Secure Framework for IoT-based Healthcare', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('f512eb4d-d186-5d54-9dd3-1198d66b7fe6', '22222222-2222-2222-2222-222222222222', 'PhD', 'Samridhi Singh', '22RCS005', 'AI Enabled Prognosis and Detection of Overian Cancer using Histopathological Imaging Modality', 'Ongoing', 'Dr N.P. Singh')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('fa002501-065c-55de-987f-3fd2c6d434c8', '22222222-2222-2222-2222-222222222222', 'MTech', 'Rishi Raj Dutta', '23MCS110', 'Balancing Plasticity and Stability in Continual Learning with UPGD and continuous Activations', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('40784f30-2d6c-5be6-b778-bd990bde25c0', '22222222-2222-2222-2222-222222222222', 'MTech', 'Grijesh Nemiwal', '23MCS014', 'Transformer based Network intrusion Detection: A Multidata set Analysis', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('ac139e64-f356-5051-b37f-e9a5999054df', '22222222-2222-2222-2222-222222222222', 'MTech', 'Akshat', '20DCS027', 'Enhancing Malware Detection Accuracy Exploring Advanced Machine Learning Strategies', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervisions (id, department_id, programme_level, scholar_name, roll_number, thesis_title, status, raw_supervisors)
VALUES ('793a8999-6f34-511d-89a5-774d8a2f3f0b', '22222222-2222-2222-2222-222222222222', 'MTech', 'Yogesh Kumar Sharma', '20DCS002', 'Deep Learning based Framework for Detection of Overian Cancer using Histopathological Images', 'Completed', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('89cf0d45-2c19-5fc9-aa96-58baac524e51', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('158bad54-810b-5a55-9f73-19eda93497a3', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('aed211d4-2436-502d-9d0f-853b09fdade2', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fe1befeb-1d6d-59cc-a7ff-f6fdf20778c3', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('e2e7f0d8-3555-5296-b667-1786637e2146', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('65f0c2b8-0458-5989-bd89-285a46d6d9cb', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('4ffa703e-4750-5b6b-baec-4d7ce84530c5', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('d0e64858-c78c-5064-a524-ff7adc9f68ad', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('53a12ba0-fee7-5de8-a93a-8bb2d2df7311', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('f4dd4221-8939-5938-aff9-f0e72928b4d7', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('a36443a7-3bae-5a19-8f45-c877e93f9a3f', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0949f068-fc98-57c7-80e0-dece98c8bab3', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fca453be-6ea6-525c-b9d3-9ad31c361d06', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6c1a6761-9915-5134-8dbf-8a1864692558', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('05bfe978-70ad-57a0-8280-82eb27090221', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('833347c1-6eaf-5817-8d33-c896b5b7f57f', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('64985d54-f998-5672-a405-5d275cb6857e', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c0dcd00f-fddc-5628-9f87-be692172b321', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('50f80197-a103-5f63-a1be-8c4f2a79e03d', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0830533d-9c5f-534b-b0c4-358385baedfb', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('20bd6356-6944-5960-9684-e6afe17b6568', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('20bd6356-6944-5960-9684-e6afe17b6568', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8e1b1c82-4957-5377-bb45-e90914cbae27', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8e1b1c82-4957-5377-bb45-e90914cbae27', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('133d78af-42c8-56b1-88d3-8374aa423d9e', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('133d78af-42c8-56b1-88d3-8374aa423d9e', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7dce3209-d5a7-5374-a079-545ced46ce22', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7dce3209-d5a7-5374-a079-545ced46ce22', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0b671db0-3817-5fdb-baff-6018f976114b', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0b671db0-3817-5fdb-baff-6018f976114b', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('18b7044c-52fb-5c22-87ab-521164a52609', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('18b7044c-52fb-5c22-87ab-521164a52609', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7e599ffe-e9e3-5fe4-b839-8e96dd7d0fa4', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('966f72de-502e-55d6-b5fa-6191bab55f57', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('9285afcd-7e62-5345-bc42-282cae3f8509', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('30833ea6-a271-5e43-98ea-a9835ebe5a30', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6e8d716b-6aff-5d49-90ba-ba6eef7b1277', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6e10569c-d6be-5cb7-bca6-29b02b67588c', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c51763df-0983-5ea0-be59-504d81c1584f', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('bc7468f1-0370-5f41-8434-e0d8f9240559', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('d9a54426-2920-53ed-8b74-aec65ab1fd1a', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fbe916df-2dca-5f58-af89-ac82c3837666', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('4afbb066-cdf2-550d-bd65-a511da8639db', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6fff9b9a-a56c-5266-b741-699c3669ebf6', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('25ffa6df-285e-5b3f-8a71-dd018412ef33', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b3227feb-e6ff-5b1c-8812-b3a72b8c86c0', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ed5e2d60-2ec4-5a16-bbf1-610c4cf03614', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('180b3ea4-3fb6-5269-8a5b-70715a57144f', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('bc5c0cd0-908e-598d-9045-3fe0e010b9f0', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ea8f6f4b-0c76-5c25-9b07-e7c4705e739a', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c7dd5f68-53ee-54fb-8047-c38bea3cc605', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c3cba0f7-95cc-55e3-b4b9-805b6939d163', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('a1efb02a-acf0-5714-a233-12f079700a3f', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b593356e-3720-5073-b607-69c158272555', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6dee2042-dceb-50c9-9995-59a66df9dc42', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('643386a7-7f72-5085-8ae8-ed5592145c1e', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b23df8c7-968f-53aa-878f-9d342cbf7c68', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2a994499-70e3-5e47-bf1b-82acf21cde4d', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0b9cfa9d-5ffb-5b43-a926-f084d1045cfd', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('bd78a7f5-78e6-5675-8087-fd82360b6268', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('4f5be7ac-874e-5272-9517-1885b16541bf', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('491193ed-21c0-5017-84b9-476be01128e5', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7a996222-eac0-55b9-8bb0-420c6160ea55', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5c198c02-a647-5e28-999a-60dfea608d66', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1efef595-981d-5bf9-8c7c-66a39a414530', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3514fa96-82a3-5e83-97c0-31b0399fc052', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5000c422-bcdc-50ba-83dd-37cdde344ba8', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5f8f1e3b-c879-54d8-9a98-74660edf6075', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('02c21b9b-47eb-530d-b2eb-f908c8afea28', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('dcdebfe1-3e7c-5d3e-a16d-0e7c17d7821c', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('d3311947-f29a-55ec-b036-7b40ff04b3e0', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('30f7be14-0ca0-5c03-bfad-0a49eee4a4e5', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2ab82eaa-f266-5f06-9e32-00a38c469d77', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('093c7b16-ebf7-51fb-b1b9-3cc6da70e6df', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7b08331b-ff5f-57d0-b527-6081bb7bd45d', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ca920083-43dd-5715-a449-3f8430d1fbde', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c77c106a-fac4-5d61-8875-1e0f102e7f46', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c95ef63a-1aad-5822-9dd1-3b4670fa1854', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('d263d4f9-ed35-5647-955d-ab76baf4afca', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('56a560a0-bad8-5ded-a6b4-be012fbc34e9', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('deaf8753-6f28-54dc-9347-7f988969b04c', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ba174466-5ca8-58f6-ac52-a699efc07c40', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c071f39e-ef0b-5f61-98db-74351f853992', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('db743c70-9d67-5822-8981-fd65ca14ead1', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('379d14f0-a592-554d-87f8-706b5dea1f4a', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('96d61258-e1d9-58cf-912e-7642a2299dd3', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3024dede-8a28-5861-bce2-3c3c5911d2d8', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('d6e3baec-7c8d-5da3-ae63-3c8d26bfa95c', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('528d3c8d-9eb1-5373-b5d5-ad554ffc6cb4', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('810c1dba-1457-5d2b-b4b0-cef54cd569cb', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('31caf28f-c1ed-503c-908c-bc9600593cea', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c75cf0b8-8eca-544b-97fe-c9eb0d5d5b52', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('40941ac8-a954-5066-8d21-d617c63bfdeb', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('388ba8f0-fffc-5798-93e1-ef05e0b68265', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('e9f2db14-20f7-56ee-9f4d-a02178c4c76c', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7302ee7e-8cd4-59ae-bd1f-7d8b4cfbe643', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('f42fae19-e743-5c9e-8027-3a9688c95f46', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('65a313f7-5e77-5e3c-b147-068cbe2a9c20', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('13356398-c56d-5ef9-969b-2fc10e335fe3', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2f8b27c9-2b95-5a66-aa37-2cb1d92bd7b9', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('9155b4c2-2a1f-5b21-82b2-ff1161ba7dab', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1fb0f286-4558-585c-a2e0-74e4abd17966', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('f71ff787-9a82-519c-8cdf-0dc9b51229ad', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('abac2236-7548-51a0-9078-0f8ce3db7993', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('e613fd43-17e8-5359-99ea-467b2aa0f0d2', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0da4c787-2a59-56f9-a2de-3e81197ad3e9', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0da4c787-2a59-56f9-a2de-3e81197ad3e9', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('41d8c9c0-a03a-5901-a22c-0f3d7a4bd739', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3ceaa03b-69ef-5937-8e84-a73181f23b1c', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6476e4ec-bb50-5edb-98d1-d0f215fb6ea1', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('782250e6-0ed0-5cb3-a86a-7800865701e4', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('84c07294-93dd-522f-8c77-7ebfad2d6349', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('592f64d9-996b-54c4-a44e-ac33a5fc1fa6', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('592f64d9-996b-54c4-a44e-ac33a5fc1fa6', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('063b6fe7-1c4b-580e-a425-0c15e5de60d5', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('063b6fe7-1c4b-580e-a425-0c15e5de60d5', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('9a947d18-692b-5d3b-992c-bac52f661e56', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('704e0507-7b23-57b3-b436-93b63e0c5799', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('704e0507-7b23-57b3-b436-93b63e0c5799', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2abf53b2-0f17-54ea-b780-a0ed40d1bc0c', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fb7b14df-5df7-5a38-9aab-9f424b179b0f', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('96127953-b87f-5889-9cc8-94917b48ebbf', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('96127953-b87f-5889-9cc8-94917b48ebbf', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2b4ecc20-495f-5fcf-9cd8-3eec087e806a', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2b4ecc20-495f-5fcf-9cd8-3eec087e806a', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0d1d3c3f-e575-5635-a03b-6a146abd65ba', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0d1d3c3f-e575-5635-a03b-6a146abd65ba', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0da3f02e-7ea7-5f36-8127-b088af5b6b51', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0da3f02e-7ea7-5f36-8127-b088af5b6b51', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('150342c1-1541-53e5-b2d9-e6a7e5ff9d18', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('150342c1-1541-53e5-b2d9-e6a7e5ff9d18', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7640c765-a38c-56f2-ab11-2055173b9569', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('a5b9f9b4-325d-53ca-85ca-5f58f845ac9c', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3d857e5a-4aa4-5afe-8dee-0946cd06d217', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('12836bb1-f89e-5c94-a775-ce5d37a6d244', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('deba2c03-75a6-5cb1-af6a-0516f53828aa', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('94c5710f-befa-56e7-af2a-0d0c3a5b44da', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('82263d75-ba7f-5a2b-b03d-a9a17030ac2c', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0473ad58-ee7f-5ba9-ad34-39a7c76c2906', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('db17f9a9-ccc6-55c7-84af-0db4c0e21c92', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('54de1661-916f-52fb-b399-df592a7f6432', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('206c338e-e9b2-5c54-a58b-acbe1850def9', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3111201c-0ba5-5475-9152-663041c41468', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('a9d5bd5a-c8a6-5978-8454-42e00c2ded29', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ee0c54b6-b87b-55e8-8e2f-fb89e5ecae42', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c73ba8f3-a7c8-5666-9f03-9d4189621a49', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2357f9d7-6e0b-58df-a149-e3e152a67571', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c2d70dfb-2150-5fad-b5ee-451623efa00d', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b373d9e2-3911-572c-891f-e8c2a550d71a', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('85276ec8-7cbf-519c-81d9-ed5a673cbf87', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('786d2fd8-924b-5c3f-b8fb-e8c485aedfab', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('90be793c-b89e-57b8-b7ea-dec96b01d458', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('89c99ef0-3671-5592-822c-8fd03e7abb5e', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('582d92c6-cd6f-5af8-a9a5-b7c81fc63f26', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8925a26c-c0a6-5bf8-b81e-92c5873dd379', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('835d9fb9-c614-5554-82bd-3d6f3e4212bf', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('e7abe105-6510-506e-9162-e231b7205ba1', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c3e0d965-17ba-53e1-a90a-3a93ee47a1cd', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('660c12be-d75f-5c90-b764-99787d4ee3a9', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('da93bfcd-2c8f-530f-81be-ad7580536999', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('f45f0400-d89a-5cc1-979e-e9b7d6652147', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3d2f73c3-3a0b-503d-ba0f-5b8b9304364c', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8d4972af-e4b3-50c0-b606-4fde36633071', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b2b7c593-482e-571f-a53d-64c93c9dd0de', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1810bdbf-1a02-55b6-8033-40dda1064770', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('eb429691-151a-5571-a068-bad31ea67324', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('e22872a2-bbd6-5a40-ac03-d73e0dc1f104', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('afdc183b-0d97-5fe4-8694-ad8746e7cd0d', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('58896e67-d340-5e03-bba2-87058a7e7a62', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('cf174aab-6835-5f32-8286-9bc130d6da58', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('cbf7235b-09bd-5210-9402-b03d2af67258', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('01dce3f7-c80a-5a51-8fbe-6dfeaaff6454', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6af28643-4df1-525d-bf66-c7322513913f', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2211f008-67da-5ec1-8216-2751cd9f7146', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('80edf5cb-a09d-510d-aeb8-7ba5060e38b2', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('e0a836e8-86b6-543a-89e0-aa36e2e516b5', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8f9af32f-5e53-5d6e-a1a7-2c52a1bd8415', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7b8429ad-8055-52ee-ac98-4334379ee0e3', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3135b2f1-5f62-5f5c-acdb-3647afa327d9', '56b955eb-618e-5dcb-ac02-f8404a61a048', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('782efcba-129b-524c-8f3a-5950dc2bd062', '56b955eb-618e-5dcb-ac02-f8404a61a048', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5077a2f4-8897-5aed-8e71-badbe1107498', '56b955eb-618e-5dcb-ac02-f8404a61a048', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c744e7db-b529-5a84-bb03-625c7a1e18c1', '56b955eb-618e-5dcb-ac02-f8404a61a048', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('833e7931-2f9d-548f-99fc-2e20d4dbe953', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5ab5edd6-8285-5b47-a8d6-6175e2b7debb', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1e15cda6-95dc-5ea1-a090-b52ba9f27084', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('70f62b1d-ce36-5d4d-a4a6-6dd86bb8df82', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('82824b46-fec3-5bdf-ab05-62a5b1786ad1', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2fa7ffd4-e6c8-57a1-a542-17719c0bb2ec', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('689acb6f-a8b8-5af9-8253-187c9cfb9028', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c29df506-5408-5783-8d51-8ec41170c846', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('3e6b6e73-b2bd-532d-aff7-1139f0127e50', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1759c6da-e4da-52bc-9ffe-7e83a88798fd', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('264ed562-25a2-5ee7-9870-ba465fd87779', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('bfa642e7-25b7-51f5-844d-0569c3ddc4ba', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1dc9fd70-ec3c-5f51-af84-e8907718e7dd', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b593bdc0-219e-5c37-b875-33d5c1acd335', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('400ea982-2e5f-5909-b6f4-b362e7bbae4a', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6ad147f3-ee9b-5723-bd51-ce1911d9f49c', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('b791029d-7a90-5b2c-abda-e43930de9617', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('4b0a7e88-b8c8-5fc8-9fef-f18275503dee', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('6e5bfe44-cf4b-52f4-b47b-f4df6d6a419f', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ac20094f-a1eb-5796-914f-25d773297390', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('9a2e8c4d-5364-5228-a251-aa55549dc336', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ce2c7776-b5a9-5b4a-9730-0dd50ef417e5', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fd8df06b-81fd-5418-8f28-a8e0be95477d', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('352e83cc-7f88-5e87-95ec-4ab2557a8a2b', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5f642dc4-8331-5542-a5ac-835250eb3598', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('58a79d15-0944-5bd7-b4e4-4992af22a144', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2c8912fe-ec1f-5d22-9dd9-862da585396f', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5d06fc16-292b-5d78-9934-aa201db98a61', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('480bcfd7-f9bb-5848-a345-852390b13ead', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ea4038b8-8560-53df-80cd-009fb3c6975a', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8a31c7a1-b18b-522d-bc3c-2d796d58c268', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('1dacaed2-ad14-5e55-85a3-c858c3f5317d', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('43f8253d-ffac-59f2-ab82-9f314c788dea', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('7708cdce-085a-5c8b-9729-370083765e40', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('2c163266-a686-57f1-be26-dc668070a982', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('0f480080-a405-55cb-b90c-135047538705', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('584fd5ea-9a20-53b5-ab99-17285017de40', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fbe01c62-d841-5b0c-aa77-851a3e665c9d', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('30091590-bbb8-5075-b9ca-83769b80f5de', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('902596c7-003c-5967-bf21-6756bda2da71', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('a2beb102-7f87-5318-b937-3ed2a6e8ffe1', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('30c5a1ba-cfdc-5655-8bf4-bbeef823a4fc', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('8535db44-eb22-5b4a-8fd9-2a233af317aa', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5c66754d-3bfe-5291-a3bc-bc58b44fd617', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('261088e7-2b2a-529a-8cea-c0ffa0509f03', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('246f0441-98cd-57f7-9815-84e596e3e4a3', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('9a361f13-28b8-53af-b577-998103c16a48', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('88ff6bce-643b-5a18-8b5c-b5d9edaa0659', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('31da3c3a-5548-56f6-840b-3cf8a490dabd', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('66ee9ffc-ed24-5a6b-b4e7-6949f235a1fb', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('afa02b82-7a9d-5317-b9a2-b1ecd955e5fb', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('bbeb38ff-17f7-5578-afbb-e5bfaf680fd1', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('5218bb6a-e6e7-57f2-b82e-e08c789ad037', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('950e572f-855b-5b00-866b-01b56fb2c693', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('a0dfea27-cabf-5efd-96b1-82aafff6a958', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('c57deb86-0322-5699-b411-5f7a5cfe367b', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('abd7c323-9566-520c-871b-779c714ea505', '9cf82300-a051-548f-b5b1-f2dfd9a1f263', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('170bcdc3-d0db-5e8c-84c4-2e548ffd7e33', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fdf11fd3-cadb-5c02-abfb-791d139b9a2c', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('f512eb4d-d186-5d54-9dd3-1198d66b7fe6', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('fa002501-065c-55de-987f-3fd2c6d434c8', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('40784f30-2d6c-5be6-b778-bd990bde25c0', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('ac139e64-f356-5051-b37f-e9a5999054df', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;
INSERT INTO supervision_supervisors (supervision_id, faculty_id, supervisor_name, role)
VALUES ('793a8999-6f34-511d-89a5-774d8a2f3f0b', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Supervisor', 'Supervisor')
ON CONFLICT DO NOTHING;

-- 15. Events
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('7013f3bb-82e0-5231-83f2-7f6f2e63e4b5', '22222222-2222-2222-2222-222222222222', 'Research Applications of Deep Learning', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2024-07-01', '2024-07-05', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('cc5bfdcb-614a-50c3-9e84-e9b3a7848cdb', '22222222-2222-2222-2222-222222222222', 'Research Applications of Deep Learning', 'E-STC', 'Online, DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2024-07-01', '2024-07-05', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('05c447a8-3552-5fc2-b53e-7cc0d11c4243', '22222222-2222-2222-2222-222222222222', 'Recent Advancements in Artificial Intelligence and Internet of Things (RAAI-2024)', 'workshop', 'Online, DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2024-04-08', '2024-04-12', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('6eef6008-3858-5f3b-8fd1-f2a555008a63', '22222222-2222-2222-2222-222222222222', 'Advancing Pedagogical Practices and Teaching Excellence-APPTEX 2024', 'STC', 'DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2024-02-12', '2024-02-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('79a6d7df-9564-59da-b900-4ff6d923c200', '22222222-2222-2222-2222-222222222222', 'International Conference on Machine Learning, Image Processing, Network Security and Data Sciences (MIND-2023)', 'conference', 'DoCSE, NIT Hamirpur', 'NIT Hamirpur, SERB, SBI', '2023-12-21', '2023-12-22', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('a680753e-20dd-510e-8397-ff678219b4fb', '22222222-2222-2222-2222-222222222222', 'Recent Trends in Networks & Communication: Theory & Challenges', 'STC', 'DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2023-09-25', '2023-09-29', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('96dcd2ae-14e5-50cb-905e-90ac502b8255', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'Online, DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2023-03-13', '2023-03-17', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('8a88ab85-276f-58ff-8840-d4abcbfa3e2a', '22222222-2222-2222-2222-222222222222', 'Recent Trends in Networks & Communication: Theory & Challenges', 'STC', 'Online, DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2021-12-01', '2021-12-06', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('68b7e93a-ac22-5202-92e8-503b9512dc90', '22222222-2222-2222-2222-222222222222', 'Recent advances in Artificial Intelligence and Internet of Things, RAAI-2021', 'STC', 'Online, DoCSE, NIT Hamirpur', 'NIT Hamirpur', '2021-09-25', '2021-09-29', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('271c2993-cc05-5fd5-ac01-c14c43634d15', '22222222-2222-2222-2222-222222222222', 'Shine Rural India with renewable Energy', 'workshop', 'IIT Delhi', 'IIT Delhi', '2016-12-13', '2016-12-13', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('a2769edb-8054-57f6-b137-dc650076e104', '22222222-2222-2222-2222-222222222222', 'International Conference on Applications of Computing and Communication Technology (ICACCT-2018)', 'conference', 'SPM college, University of Delhi', 'University of Delhi', '2018-03-09', '2018-03-09', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('2e926e7d-e7fe-5402-93d7-834a58c88ae6', '22222222-2222-2222-2222-222222222222', 'Faculty Development Program on Research Trends in AI and Mobile Systems', 'STC', 'NIT Hamirpur', 'NIT Hamirpur', '2019-12-16', '2019-12-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('2d072d41-8a66-5ee5-b6fd-6184f73f47f4', '22222222-2222-2222-2222-222222222222', 'E-STC on Recent Trends in Networks and Communication', 'STC', 'Online', 'NIT Hamirpur', '2021-12-01', '2021-12-01', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('f2dfa4e2-da00-55ab-963e-c29da1e8abd0', '22222222-2222-2222-2222-222222222222', '2nd E-STC on Recent Trends in Networks and Communications', 'STC', 'Online', 'NIT Hamirpur', '2023-09-25', '2023-09-29', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('b0e34b43-68a5-5c25-8a6e-01659ce999ce', '22222222-2222-2222-2222-222222222222', '3rd STC on Recent Trends in Networks and Communications', 'STC', 'Offline', 'NIT Hamirpur', '2024-09-23', '2024-09-29', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('abc39b0c-8073-58f2-b6c4-f8e3e02f2deb', '22222222-2222-2222-2222-222222222222', 'National Conference on Emerging Trends in Computing & Communication(ETCC�08)', 'conference', 'NIT Hamirpur', 'NIT Hamirpur', '2008-12-30', '2008-12-31', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('278043b1-6aab-5015-87bc-756ef313cfc2', '22222222-2222-2222-2222-222222222222', 'ISTE Section Annual Convention 2007', 'conference', 'NIT Hamirpur', 'NIT Hamirpur', '2007-11-08', '2007-11-19', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('c474dbd4-7af9-54d7-8566-a8eb86b76a26', '22222222-2222-2222-2222-222222222222', 'Winter School on Linux System Administration and Programming LSAP-09', 'STC', 'NIT Hamirpur', 'AICTE/MHRD', '2009-12-14', '2009-12-18', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('5185ab78-b179-5907-a5f8-5d5bcf4cdf83', '22222222-2222-2222-2222-222222222222', 'e-Learning Management System ELMs-10', 'STC', 'NIT Hamirpur', 'NIT Hamirpur', '2010-01-05', '2010-01-09', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('1843d92b-f5a2-56b9-926d-2755c6732acb', '22222222-2222-2222-2222-222222222222', 'Cyber-Physical System Security with Artificial Intelligence', 'GIAN', 'NIT Hamirpur', 'GIAN, IIT Hyderabad', '2025-02-03', '2025-02-14', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('fedd7005-137e-50a3-a7de-22db6b08af25', '22222222-2222-2222-2222-222222222222', 'First International Conference on Advances in Computing and Communication', 'conference', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2011-04-08', '2011-04-10', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('e1b05b06-511e-53dc-8fca-b980b127801c', '22222222-2222-2222-2222-222222222222', 'Machine Learning for Natural Language Processing (MNLP-2020)', 'E-STC', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2020-10-12', '2020-10-17', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('7f20f338-2aad-5511-a2ce-19144d29df01', '22222222-2222-2222-2222-222222222222', '5th International Conference on Machine Learning, Image Processing, Network Security and Data Sciences', 'conference', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2023-12-21', '2023-12-22', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('88d81251-ad87-5516-b6fa-dc4531658979', '22222222-2222-2222-2222-222222222222', 'Recent Trends in Transport Phenomena (RTTP 2024)', 'conference', 'NIT Hamirpur', 'NIT Hamirpur', '2024-06-24', '2024-06-26', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('002b71c0-e85f-5706-83d2-db38890e84d0', '22222222-2222-2222-2222-222222222222', '2nd International Conference on Artificial Intelligence, Machine Learning and Intelligent Systems (ICAMS 2025)', 'conference', 'NIT Hamirpur', 'NIT Hamirpur', '2025-02-07', '2025-02-08', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('e8579515-31ea-5910-ab63-fb002242300a', '22222222-2222-2222-2222-222222222222', '40th National Conference on Fluid Mechanics and Fluid Power (NCFMFP-13)', 'conference', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2013-12-12', '2013-12-14', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('99403bfa-c973-5975-9267-a653a2042ec8', '22222222-2222-2222-2222-222222222222', 'Civil Engineering Conference – Innovation for Sustainability (CEC-2016)', 'conference', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2016-09-09', '2016-09-10', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('539f2970-95de-54b0-a79a-87b9cdf70f81', '22222222-2222-2222-2222-222222222222', 'Winter School on Mobile and Distributed Systems: Theory and Challenges', 'STC', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2013-12-02', '2013-12-06', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('e5c74674-0ced-5226-a498-014308a31b3d', '22222222-2222-2222-2222-222222222222', 'Winter School on Mobile and Distributed systems: Theory and Challenges (MDS-13)', 'STC', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2013-12-02', '2013-12-06', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('aab15c10-3297-500a-987f-261b88acbbfe', '22222222-2222-2222-2222-222222222222', 'STC on Recent Trends in Networks & Communication: Theory & Challenges', 'STC', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2021-12-01', '2021-12-06', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('95f2a01e-62cf-5dd6-84cf-b9df38b4d9ea', '22222222-2222-2222-2222-222222222222', 'Recent Trends in Networks & Communication: Theory & Challenges', 'STC', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2023-09-25', '2023-09-29', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('f991b94a-739b-5878-b030-333cf8cf20c5', '22222222-2222-2222-2222-222222222222', 'Training & Skill development Program for HPPCL Employees on E-Governance', 'workshop', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2018-01-18', '2018-01-19', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('caa832a5-125e-5e95-b62b-2aaf4554bbbf', '22222222-2222-2222-2222-222222222222', 'Workshop on Wireless Sensor Networks Classroom Kit and Wireless Sensor Networks Professional Kit', 'workshop', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2014-03-04', '2014-03-05', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('377b68eb-7139-5bb3-9b83-db67708fd1b9', '22222222-2222-2222-2222-222222222222', 'Mobile Device Security', 'STC', 'DoCSE, NIT Hamirpur', 'Ministry of Electronics and Information Technology', '2025-02-23', '2025-03-27', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('1bdb1ae1-6a94-54b2-9e55-1af8015c5570', '22222222-2222-2222-2222-222222222222', 'Artificial Intelligence, Machine Learning & Intelligent Systems (ICAMS-2025)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2025-02-07', '2025-02-08', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('b0b2e6d8-09f3-5310-a203-37c263bfcaa4', '22222222-2222-2222-2222-222222222222', 'Emerging Trends in Computing & Communication (ETCC-07)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2007-07-27', '2007-07-28', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('2e804c5e-12e4-5e03-bd85-06519261e5c1', '22222222-2222-2222-2222-222222222222', 'ISTE (Section Annual Convention)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2007-11-18', '2007-11-19', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('afe0e2ab-e0a9-55d1-bd55-be36a09cd3a3', '22222222-2222-2222-2222-222222222222', 'Emerging Trends in Computing & Communication (ETCC-08)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2008-12-30', '2008-12-31', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('5fe91be4-02d5-5a03-b529-489b76b7c7f4', '22222222-2222-2222-2222-222222222222', 'Advances in Computing & Communication', 'conference', 'DoCSE, NIT Hamirpur', 'MHRD', '2011-04-08', '2011-04-10', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('77fb9502-cd1f-5620-b226-fc3648fe8d50', '22222222-2222-2222-2222-222222222222', 'ISTE (Section Annual Convention)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2015-09-30', '2015-10-01', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('953e64b9-8d56-54b4-8919-e84b1a12157c', '22222222-2222-2222-2222-222222222222', 'ISTE (Section Annual Convention)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2015-09-30', '2015-10-01', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('f0ef12a5-524f-5419-a863-6d6ef97f2a5f', '22222222-2222-2222-2222-222222222222', 'ISTE (Section Annual Convention)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2015-09-30', '2015-10-01', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('e1d0e223-ef7b-52e3-940a-4c143a2b60f6', '22222222-2222-2222-2222-222222222222', 'Emerging Trends in Engineering, Innovations & Technology Management (ICET:EITM-2017)', 'conference', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2017-12-16', '2017-12-17', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('1d462741-37c0-53fd-9d34-68af6b0525a1', '22222222-2222-2222-2222-222222222222', 'Emerging Trends in Engineering, Innovations & Technology Management (ICET:EITM-2017)', 'STC', 'NIT Hamirpur', 'TEQIP / Self-Sponsored', '2006-12-18', '2006-12-22', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('7f0169d1-3825-5b40-ae95-298e199e741f', '22222222-2222-2222-2222-222222222222', 'Winter School on Mobile Computing', 'STC', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2006-12-18', '2006-12-22', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('db223ad0-ee2b-5826-bb15-92259d011a2d', '22222222-2222-2222-2222-222222222222', 'Cloud Computing', 'STC', 'DoCSE, NIT Hamirpur', 'AICTE', '2009-12-28', '2010-01-01', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('0000e84b-e44c-55df-9817-4f346c3859af', '22222222-2222-2222-2222-222222222222', 'Mobile Computing & Communication', 'STC', 'DoCSE, NIT Hamirpur', 'TEQIP / Self-Sponsored', '2013-06-17', '2013-06-21', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('d0aadc26-f8d4-5352-9503-5bd072f3bacb', '22222222-2222-2222-2222-222222222222', 'Security Trends in Mobile Ad-hoc & Sensor Systems', 'STC', 'DoCSE, NIT Hamirpur', 'ISEA Project Phase – II', '2016-03-11', '2016-03-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('f63d4a0b-84ae-55b1-87d7-e947b50122fe', '22222222-2222-2222-2222-222222222222', 'Security Trends in Mobile Ad-hoc & Sensor Systems', 'STC', 'DoCSE, NIT Hamirpur', 'ISEA Project Phase – II', '2007-02-02', '2007-02-07', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('a02e9533-11de-5f2e-8ee8-0ca5e6a5b475', '22222222-2222-2222-2222-222222222222', 'Cyber-Physical System Security with Artificial Intelligence', 'GIAN', 'NIT HAMIRPUR', 'GIAN HYDRABAD', '2025-02-03', '2025-02-15', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('26e0013e-c03a-580d-9b6b-6c94bda044c4', '22222222-2222-2222-2222-222222222222', 'Short term training program for SC trainees at ITI Joginder Nagar', 'STC', 'NIT Hamirpur', 'ITI JOGINDER NAGAR', '2022-12-23', '2022-12-27', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('5189fc38-ccb5-5b5f-8efb-81ea75dd91e3', '22222222-2222-2222-2222-222222222222', 'Short term training program for SC trainees at ITI Joginder Nagar', 'STC', 'NIT Hamirpur', 'ITI JOGINDER NAGAR', '2023-06-05', '2023-06-10', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('add9dcbf-c186-586e-b674-b8ccde2ca35a', '22222222-2222-2222-2222-222222222222', 'Short term training program for SC trainees at ITI Joginder Nagar', 'STC', 'NIT Hamirpur', 'ITI JOGINDER NAGAR', '2023-06-05', '2023-06-10', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('cdce186e-5f9a-5f9f-bcf0-4f01507d90c7', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2025-01-20', '2025-01-24', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('cb513f29-82e5-5c44-bf98-55ca3233073c', '22222222-2222-2222-2222-222222222222', 'Short term training program for SC trainees at ITI Joginder Nagar', 'STC', 'NIT Hamirpur', 'ITI JOGINDER NAGAR', '2023-06-05', '2023-06-10', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('a2e4ae07-d41a-53eb-b484-6b57e6dd47b0', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2025-01-20', '2025-01-24', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('8f6f1289-9379-50df-a02e-06b40e79692e', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2026-04-21', '2026-04-22', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('b4fc51b8-730c-5af5-a4ef-a05f223b60ed', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2026-04-21', '2026-04-23', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('d1f7079b-ef50-5486-9f8d-7815b04ed326', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2026-04-21', '2026-04-23', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('3d9bd24a-ddd5-5487-b2d1-9129a841045e', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2025-01-20', '2025-01-24', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('9b04185b-b22e-565e-901f-5466509fc18c', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT HAMIRPUR', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('3c39572d-7b37-5682-9dd8-053d4617d1a3', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'STC', 'NIT HAMIRPUR', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('486d9262-3fa6-50ff-8b07-7203a9724ed7', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'STC', 'NIT HAMIRPUR', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('1207497c-7bdc-56dd-8fa4-e69d1c4a9042', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'STC', 'NIT HAMIRPUR', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('c6a3da9b-841a-5ab5-9459-05756af71323', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'workshop', 'NIT HAMIRPUR', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('4bf86a55-7851-51e8-9843-05856c3d1ea6', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'workshop', 'NIT HAMIRPUR', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('77d9aafc-9961-5615-8c65-a99ca8533d38', '22222222-2222-2222-2222-222222222222', 'Machine Learning and its applications in lnformation Security, Computer Vision and Natural Language Processing', 'E-STC', 'NIT Hamirpur', 'NIT Hamirpur', '2026-01-12', '2026-01-16', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('95520148-5a28-5cd0-9c15-12ae9026b1d4', '22222222-2222-2222-2222-222222222222', 'hh', 'STC', 'hh', 'hdfh', '2026-04-09', '2026-04-17', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('bfd8113f-31e2-523f-9140-4b1a25196b20', '22222222-2222-2222-2222-222222222222', 'hh', 'E-STC', 'hh', 'hdfh', '2026-04-09', '2026-04-17', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('22418378-3b78-5a28-bb71-e80dd6be752f', '22222222-2222-2222-2222-222222222222', 'erg', 'STC', '123 Main Street', 'jihu', '2026-03-31', '2026-04-03', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('9f472b5f-61d3-56f6-a800-a521327feeb0', '22222222-2222-2222-2222-222222222222', 'test2', 'workshop', 'dsf', 'fds', '2026-04-17', '2026-04-23', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('4fb66324-601b-5b34-8f85-aafd92d6c6c8', '22222222-2222-2222-2222-222222222222', 'test3', 'workshop', 'dsf', 'fds', '2026-04-17', '2026-04-23', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('65530f0a-574c-5530-b542-664f6f41dcb4', '22222222-2222-2222-2222-222222222222', 'test4', 'workshop', 'dsf', 'fds', '2026-04-17', '2026-04-23', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO events (id, department_id, title, event_type, venue, sponsor, start_date, end_date, year)
VALUES ('c75a98ac-21dc-5d78-ab95-17cfd76bfb0b', '22222222-2222-2222-2222-222222222222', 'test4', 'workshop', 'dsf', 'fds', '2026-04-17', '2026-04-23', 2024)
ON CONFLICT (id) DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('cc5bfdcb-614a-50c3-9e84-e9b3a7848cdb', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('cc5bfdcb-614a-50c3-9e84-e9b3a7848cdb', '3d607ef3-b375-5ece-9f8b-84feb2ed4a16', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('cc5bfdcb-614a-50c3-9e84-e9b3a7848cdb', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('05c447a8-3552-5fc2-b53e-7cc0d11c4243', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('05c447a8-3552-5fc2-b53e-7cc0d11c4243', '7f377458-de96-52a7-b8cf-04e50369469a', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('05c447a8-3552-5fc2-b53e-7cc0d11c4243', '56b955eb-618e-5dcb-ac02-f8404a61a048', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('6eef6008-3858-5f3b-8fd1-f2a555008a63', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('6eef6008-3858-5f3b-8fd1-f2a555008a63', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('6eef6008-3858-5f3b-8fd1-f2a555008a63', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('79a6d7df-9564-59da-b900-4ff6d923c200', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('79a6d7df-9564-59da-b900-4ff6d923c200', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('79a6d7df-9564-59da-b900-4ff6d923c200', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('79a6d7df-9564-59da-b900-4ff6d923c200', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('a680753e-20dd-510e-8397-ff678219b4fb', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('a680753e-20dd-510e-8397-ff678219b4fb', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('a680753e-20dd-510e-8397-ff678219b4fb', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('96dcd2ae-14e5-50cb-905e-90ac502b8255', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('96dcd2ae-14e5-50cb-905e-90ac502b8255', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('96dcd2ae-14e5-50cb-905e-90ac502b8255', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('68b7e93a-ac22-5202-92e8-503b9512dc90', 'bfb209c7-3e80-531b-ab07-7e9829b6f9be', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('68b7e93a-ac22-5202-92e8-503b9512dc90', '33007428-2ecd-5b52-93aa-b6849142c098', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('68b7e93a-ac22-5202-92e8-503b9512dc90', 'f78d864c-94e1-5cdf-9672-b2c891bb2abb', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('271c2993-cc05-5fd5-ac01-c14c43634d15', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('a2769edb-8054-57f6-b137-dc650076e104', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('2e926e7d-e7fe-5402-93d7-834a58c88ae6', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('2d072d41-8a66-5ee5-b6fd-6184f73f47f4', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('f2dfa4e2-da00-55ab-963e-c29da1e8abd0', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('b0e34b43-68a5-5c25-8a6e-01659ce999ce', '7ea23dd5-a666-543f-b04d-fdc4563b500c', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('1843d92b-f5a2-56b9-926d-2755c6732acb', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('1843d92b-f5a2-56b9-926d-2755c6732acb', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('fedd7005-137e-50a3-a7de-22db6b08af25', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('e1b05b06-511e-53dc-8fca-b980b127801c', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('7f20f338-2aad-5511-a2ce-19144d29df01', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('88d81251-ad87-5516-b6fa-dc4531658979', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('002b71c0-e85f-5706-83d2-db38890e84d0', '0bdba158-8848-57a1-8223-ccdf001d9c5b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('e8579515-31ea-5910-ab63-fb002242300a', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('99403bfa-c973-5975-9267-a653a2042ec8', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('539f2970-95de-54b0-a79a-87b9cdf70f81', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('e5c74674-0ced-5226-a498-014308a31b3d', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('aab15c10-3297-500a-987f-261b88acbbfe', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('95f2a01e-62cf-5dd6-84cf-b9df38b4d9ea', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('f991b94a-739b-5878-b030-333cf8cf20c5', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('caa832a5-125e-5e95-b62b-2aaf4554bbbf', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('377b68eb-7139-5bb3-9b83-db67708fd1b9', '8f3440cb-d43b-5454-a7fd-9f9179831f9f', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('377b68eb-7139-5bb3-9b83-db67708fd1b9', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('377b68eb-7139-5bb3-9b83-db67708fd1b9', '8baebe79-6e19-545b-a306-0d8b8ca2382b', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('377b68eb-7139-5bb3-9b83-db67708fd1b9', '6ba9979b-078d-563a-ae15-44354e3c8fb0', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('1bdb1ae1-6a94-54b2-9e55-1af8015c5570', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('b0b2e6d8-09f3-5310-a203-37c263bfcaa4', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('2e804c5e-12e4-5e03-bd85-06519261e5c1', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('afe0e2ab-e0a9-55d1-bd55-be36a09cd3a3', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('5fe91be4-02d5-5a03-b529-489b76b7c7f4', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('f0ef12a5-524f-5419-a863-6d6ef97f2a5f', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('e1d0e223-ef7b-52e3-940a-4c143a2b60f6', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('7f0169d1-3825-5b40-ae95-298e199e741f', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('db223ad0-ee2b-5826-bb15-92259d011a2d', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('0000e84b-e44c-55df-9817-4f346c3859af', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('d0aadc26-f8d4-5352-9503-5bd072f3bacb', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('f63d4a0b-84ae-55b1-87d7-e947b50122fe', '3d84f2ba-e5ae-5995-90ed-576fc675f3e2', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('26e0013e-c03a-580d-9b6b-6c94bda044c4', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('26e0013e-c03a-580d-9b6b-6c94bda044c4', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('cb513f29-82e5-5c44-bf98-55ca3233073c', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('cb513f29-82e5-5c44-bf98-55ca3233073c', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('3d9bd24a-ddd5-5487-b2d1-9129a841045e', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('77d9aafc-9961-5615-8c65-a99ca8533d38', 'bab88791-e99c-561e-986e-2a99c8c84b19', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('77d9aafc-9961-5615-8c65-a99ca8533d38', '88d09aab-214e-509e-8038-c6bd8ddb63c7', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;
INSERT INTO event_coordinators (event_id, faculty_id, coordinator_name, role)
VALUES ('77d9aafc-9961-5615-8c65-a99ca8533d38', 'e3ef51f2-e033-53bd-81ed-6bb1109a1b1e', 'Faculty Coordinator', 'Coordinator')
ON CONFLICT DO NOTHING;

-- 16. Students Registry
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS001', 'AADITYA SHAKYA', 2025, 3, '24BCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS002', 'AADVIK RAJ', 2025, 3, '24BCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS003', 'ABHAY DHIMAN', 2025, 3, '24BCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS004', 'ABHAY KUMAR', 2025, 3, '24BCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS005', 'ABHISHIKA CHOUDHARY', 2025, 3, '24BCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS006', 'ACHYUT KRISHNA', 2025, 3, '24BCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS007', 'ADITYA CHAUHAN', 2025, 3, '24BCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS008', 'ADITYA KUMAR', 2025, 3, '24BCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS009', 'ADITYA NANDA', 2025, 3, '24BCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS010', 'ADRITYA', 2025, 3, '24BCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS011', 'AKASH MAVI', 2025, 3, '24BCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS012', 'AKSHAY KUMAR', 2025, 3, '24BCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS013', 'AKSHITA SHARMA', 2025, 3, '24BCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS014', 'AMIT KUMAR SHARMA', 2025, 3, '24BCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS015', 'ANCIL', 2025, 3, '24BCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS016', 'ANGOTHU VIGNESH', 2025, 3, '24BCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS017', 'ANILOVE', 2025, 3, '24BCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS018', 'ANKIT KUMAR', 2025, 3, '24BCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS019', 'ANKIT PATEL', 2025, 3, '24BCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS020', 'ANKUSH', 2025, 3, '24BCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS021', 'ANKUSH SHARMA', 2025, 3, '24BCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS022', 'ANSHU KUMARI', 2025, 3, '24BCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS023', 'ANURAG SINGH', 2025, 3, '24BCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS024', 'ARGHYA SHARMA', 2025, 3, '24BCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS025', 'ARPIT SINGH', 2025, 3, '24BCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS026', 'ARSHITA JARYAL', 2025, 3, '24BCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS027', 'ARYAN SHARMA', 2025, 3, '24BCS027@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS028', 'ASHUTOSH KUMAR', 2025, 3, '24BCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS029', 'ASHVIN NEGI', 2025, 3, '24BCS029@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS030', 'ATHARV BABBAR', 2025, 3, '24BCS030@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS031', 'ATUL KOUNDAL', 2025, 3, '24BCS031@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS032', 'AVADHI JAIN', 2025, 3, '24BCS032@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS033', 'AYUSH BHATT', 2025, 3, '24BCS033@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS034', 'AYUSH KUMAR', 2025, 3, '24BCS034@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS035', 'AYUSH SINGH', 2025, 3, '24BCS035@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS036', 'AYUSHI SHARMA', 2025, 3, '24BCS036@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS037', 'DAKSH SHARMA', 2025, 3, '24BCS037@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS038', 'DEEPAK KUMAR MEENA', 2025, 3, '24BCS038@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS039', 'DEVANSH SINGH', 2025, 3, '24BCS039@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS040', 'DHEERAJ KATIYAR', 2025, 3, '24BCS040@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS041', 'DIVYAM SINGH DUHOON', 2025, 3, '24BCS041@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS042', 'DIVYANSH JAMWAL', 2025, 3, '24BCS042@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS043', 'DRISHTI SINGH', 2025, 3, '24BCS043@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS044', 'EKLAVYA SINGH', 2025, 3, '24BCS044@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS045', 'GAURAV GORA', 2025, 3, '24BCS045@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS046', 'GAURAV PUROHIT', 2025, 3, '24BCS046@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS047', 'GAURAV VERMA', 2025, 3, '24BCS047@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS048', 'GURKHE RITESH RAJENDRA', 2025, 3, '24BCS048@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS049', 'HARSHIT', 2025, 3, '24BCS049@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS050', 'HARSHIT PRATAP SINGH', 2025, 3, '24BCS050@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS051', 'HIMANSHU MANDAL', 2025, 3, '24BCS051@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS052', 'HUNER CHAUHAN', 2025, 3, '24BCS052@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS053', 'ISHANT CHOUDHARY', 2025, 3, '24BCS053@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS054', 'ISHANT SHARMA', 2025, 3, '24BCS054@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS055', 'JATIN', 2025, 3, '24BCS055@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS056', 'KANISHK', 2025, 3, '24BCS056@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS057', 'KARNATI SAI UTTEJ', 2025, 3, '24BCS057@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS058', 'KESHAV SHARMA', 2025, 3, '24BCS058@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS059', 'KESHAV SONI', 2025, 3, '24BCS059@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS060', 'KOMAL KUMARI', 2025, 3, '24BCS060@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS061', 'KRISHNA GUPTA', 2025, 3, '24BCS061@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS062', 'KRISHNA THAKUR', 2025, 3, '24BCS062@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS063', 'KSHITIJ', 2025, 3, '24BCS063@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS064', 'LAKSH GUPTA', 2025, 3, '24BCS064@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS065', 'LAKSHAY', 2025, 3, '24BCS065@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS066', 'LAVISH', 2025, 3, '24BCS066@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS067', 'LOVENEET CHAUHAN', 2025, 3, '24BCS067@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS068', 'MAHENDER SINGH', 2025, 3, '24BCS068@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS069', 'MANAN GUPTA', 2025, 3, '24BCS069@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS070', 'MAYANK BANIYA', 2025, 3, '24BCS070@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS071', 'MOHAMMAD ASAD IKRAM', 2025, 3, '24BCS071@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS072', 'MONIL CHOURASIYA', 2025, 3, '24BCS072@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS073', 'NAMAN PRATAP SINGH', 2025, 3, '24BCS073@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS074', 'NAVISH KUMAR', 2025, 3, '24BCS074@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS075', 'NEERAD SOOD', 2025, 3, '24BCS075@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS076', 'PARISHA CHAUHAN', 2025, 3, '24BCS076@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS077', 'PARTH THAKUR', 2025, 3, '24BCS077@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS078', 'PARTHIVI PRADHAN', 2025, 3, '24BCS078@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS079', 'PIKANSHI', 2025, 3, '24BCS079@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS080', 'POOJA KUMARI', 2025, 3, '24BCS080@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS081', 'POTHULA PARDHIV', 2025, 3, '24BCS081@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS082', 'PRAGATI VERMA', 2025, 3, '24BCS082@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS084', 'PRASHANT BAHUGUNA', 2025, 3, '24BCS084@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS085', 'PRASHANT THAKUR', 2025, 3, '24BCS085@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS086', 'PREMLATA VIJENDRA Gupta', 2025, 3, '24BCS086@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS087', 'PRINCE PUNDIR', 2025, 3, '24BCS087@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS088', 'PRITIKA SWAMI', 2025, 3, '24BCS088@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS089', 'PUNEET YADAV', 2025, 3, '24BCS089@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS090', 'RAJAT AGGARWAL', 2025, 3, '24BCS090@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS091', 'RAJEEV RATHAUR', 2025, 3, '24BCS091@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS092', 'RAJKARAN AGARWAL', 2025, 3, '24BCS092@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS093', 'RAKHI', 2025, 3, '24BCS093@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS094', 'RAMAN BANSAL', 2025, 3, '24BCS094@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS096', 'RAVI KUMAR VERMA', 2025, 3, '24BCS096@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS097', 'SAHIL KASHYAP', 2025, 3, '24BCS097@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS098', 'SAJJA MANOJ MOHI', 2025, 3, '24BCS098@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS099', 'SAKSHAM SHANDILYA', 2025, 3, '24BCS099@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS100', 'SAKSHI', 2025, 3, '24BCS100@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS101', 'SARTHAK SHARMA', 2025, 3, '24BCS101@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS102', 'SAUMYA JAISWAL', 2025, 3, '24BCS102@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS103', 'SAURABH CHAUHAN', 2025, 3, '24BCS103@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS104', 'SHARDUL SHARMA', 2025, 3, '24BCS104@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS105', 'SHASHWAT SINGH', 2025, 3, '24BCS105@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS106', 'SHIVANG SHARMA', 2025, 3, '24BCS106@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS107', 'SIDDHARTH', 2025, 3, '24BCS107@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS108', 'SITANSHU NAYAN', 2025, 3, '24BCS108@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS109', 'SOURAV CHOUDHARY', 2025, 3, '24BCS109@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS110', 'SUHANEE THAKUR', 2025, 3, '24BCS110@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS111', 'SUMIT KUMAR', 2025, 3, '24BCS111@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS112', 'TANIYA', 2025, 3, '24BCS112@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS113', 'TANMAY SINGH', 2025, 3, '24BCS113@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS114', 'UMESH KUMAR KUMAWAT', 2025, 3, '24BCS114@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS115', 'UTKARSH SHUKLA', 2025, 3, '24BCS115@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS116', 'VAISHALI', 2025, 3, '24BCS116@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS117', 'VANNI VARCHASVI CHAUHAN', 2025, 3, '24BCS117@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS118', 'VANSH CHOUDHARY', 2025, 3, '24BCS118@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS119', 'VANSHIKA SHARMA', 2025, 3, '24BCS119@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS120', 'VANYA SHARMA', 2025, 3, '24BCS120@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS121', 'VINAY', 2025, 3, '24BCS121@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS122', 'VISHAL BAGDI', 2025, 3, '24BCS122@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS123', 'VYOM PANT', 2025, 3, '24BCS123@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS124', 'ZULIKHA BANOO', 2025, 3, '24BCS124@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS125', 'HIMANI BHARDWAJ', 2025, 3, '24BCS125@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS126', 'PRASMETA PRASAETA BEHERA', 2025, 3, '24BCS126@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS127', 'KARTHIK BYJU', 2025, 3, '24BCS127@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS128', 'SMITKUMAR BHARATKUMAR MISTRY', 2025, 3, '24BCS128@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS129', 'DHRUV KHANDATRAY', 2025, 3, '24BCS129@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS131', 'BHOLA PRASAD SAH', 2025, 3, '24BCS131@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS132', 'ANSHIKA SHARMA', 2025, 3, '24BCS132@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '24BCS133', 'BARNIL DASH', 2025, 3, '24BCS133@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS001', 'AANYA SONI', 2025, 5, '23BCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS002', 'AAYUSH KRISHNA', 2025, 5, '23BCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS003', 'AAYUSH SHARMA', 2025, 5, '23BCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS004', 'ABBU HARISHWAR REDDY', 2025, 5, '23BCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS005', 'ABHAY CHAUDHARY', 2025, 5, '23BCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS006', 'ABHINAV SHARMA', 2025, 5, '23BCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS007', 'ABHISHEK', 2025, 5, '23BCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS008', 'ABHISHEK GAUTAM', 2025, 5, '23BCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS009', 'ABHISHEK RANA', 2025, 5, '23BCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS011', 'AJAY BAIRWA', 2025, 5, '23BCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS012', 'AJAY KUMAR', 2025, 5, '23BCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS013', 'AKASHDEEP SINGH', 2025, 5, '23BCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS015', 'AKSHAT MANITRIPATHI', 2025, 5, '23BCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS016', 'AKSHAT SINGH', 2025, 5, '23SCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS018', 'AKSHIT PATHANIA', 2025, 5, '23BCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS019', 'AKSHIT THAKUR', 2025, 5, '23BCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS020', 'AMGOTH SRINIVAS', 2025, 5, '23BCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS021', 'ANSHUMAN SINGH KAPOOR', 2025, 5, '23BCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS022', 'ARIHANI DOGRA', 2025, 5, '23BCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS023', 'ARPIT', 2025, 5, '23BCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS024', 'ARTI', 2025, 5, '23BCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS025', 'ARYAN CHAUDHARY', 2025, 5, '23BCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS026', 'AYUSH BHARDWAJ', 2025, 5, '23BCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS027', 'AYUSH SHARMA', 2025, 5, '23BCS027@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS028', 'BINDU', 2025, 5, '23BCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS029', 'DEPAVATH GOPAL', 2025, 5, '23BCS029@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS030', 'DEVANSHU', 2025, 5, '23BCS030@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS031', 'DHAIRYA BHARDWAJ', 2025, 5, '23BCS031@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS032', 'DISHU', 2025, 5, '23BCS032@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS033', 'GURUDUTT SINGHAL', 2025, 5, '23BCS033@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS034', 'GYANESHWAR CHANDRA KANNAUJIYA', 2025, 5, '23BCS034@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS035', 'HARSH PRABHAT JHA', 2025, 5, '23BCS035@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS036', 'HIMANSHU', 2025, 5, '23BCS036@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS037', 'HIMANSHU MAHAJAN', 2025, 5, '23BCS037@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS038', 'ISHA', 2025, 5, '23BCS038@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS039', 'ISHAN', 2025, 5, '23BCS039@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS040', 'ISHITA', 2025, 5, '23BCS040@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS041', 'JAIKRISHAN SHARMA', 2025, 5, '23BCS041@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS042', 'JASHANPREET KAUR', 2025, 5, '23BCS042@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS043', 'JASHNIKA SANKHUA', 2025, 5, '23BCS043@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS044', 'KAJAL KATNORIA', 2025, 5, '23BCS044@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS045', 'KAMGARI RISHITHREDDY', 2025, 5, '23BCS045@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS046', 'KANISHK SINGH', 2025, 5, '23BCS046@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS047', 'KARANTOTH MAHESH', 2025, 5, '23BCS047@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS048', 'KARTIK SINHA', 2025, 5, '23BCS048@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS049', 'KASHISH SAINI', 2025, 5, '23BCS049@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS050', 'KHUSHI', 2025, 5, '23BCS050@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS051', 'KISHAN KUMAR', 2025, 5, '23BCS051@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS052', 'KUNAL MAHTO', 2025, 5, '23BCS052@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS053', 'KUNAL THAKUR', 2025, 5, '23BCS053@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS054', 'LAKSHAY LALIA', 2025, 5, '23BCS054@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS055', 'LOKESH KUMAR', 2025, 5, '23BCS055@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS056', 'LOKESH PANDEY', 2025, 5, '23BCS056@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS057', 'MADHAV GOYAL', 2025, 5, '23BCS057@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS058', 'MANDEEP KUMAR', 2025, 5, '23BCS058@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS059', 'MANGAL PATEL', 2025, 5, '23BCS059@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS060', 'MANYA SINGH LALHALL', 2025, 5, '23BCS060@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS061', 'MAYANK SINGH TOMAR', 2025, 5, '23BCS061@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS062', 'MEHAK SHARMA', 2025, 5, '23BCS062@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS063', 'MRITUNJAI GUPTA', 2025, 5, '23BCS063@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS064', 'MUDAVATH RAHUL', 2025, 5, '23BCS064@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS065', 'MYLAR JEEVAN', 2025, 5, '23BCS065@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS066', 'NAVDEEPSINGH', 2025, 5, '23BCS066@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS067', 'NIDHISH GUPTA', 2025, 5, '23BCS067@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS068', 'NIKHIL RANA', 2025, 5, '23BCS068@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS069', 'NIKIT SHARI', 2025, 5, '23BCS069@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS070', 'NISHANT', 2025, 5, '23BCS070@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS071', 'NISHANT BHANDARI', 2025, 5, '23BCS071@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS072', 'NISHANT SHARMA', 2025, 5, '23BCS072@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS073', 'PALAK SHARMA', 2025, 5, '23BCS073@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS074', 'PINKI', 2025, 5, '23BCS074@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS075', 'PRABHANKAR TIWARI', 2025, 5, '23BCS075@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS076', 'PRAGYA SHARMA', 2025, 5, '23BCS076@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS077', 'PRAKHAR PANDEY', 2025, 5, '23BCS077@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS078', 'PRAMOD KUMAR', 2025, 5, '23BCS078@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS079', 'PRITAM SINGH', 2025, 5, '23BCS079@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS080', 'PRIYANSH SOOD', 2025, 5, '23BCS080@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS081', 'PUNITHA.N', 2025, 5, '23BCS081@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS082', 'PUSHP RAJ BHARTI', 2025, 5, '23BCS082@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS083', 'RAJAT SHARMA', 2025, 5, '23BCS083@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS084', 'RAJEEV RANJAN', 2025, 5, '23BCS084@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS085', 'RAJVIL CHOUDHARY', 2025, 5, '23BCS085@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS086', 'RAMIT', 2025, 5, '23BCS086@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS087', 'RISHABH SHARMA', 2025, 5, '23BCS087@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS088', 'RISHABH SHARMA', 2025, 5, '23BCS088@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS089', 'RISHIK BHARDWAJ', 2025, 5, '23BCS089@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS090', 'RISHIT GAUTAM', 2025, 5, '23BCS090@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS091', 'RITIK KUMAR', 2025, 5, '23BCS091@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS092', 'RUDRA BHATIA', 2025, 5, '23BCS092@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS093', 'RUDRANSH SHARMA', 2025, 5, '23BCS093@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS094', 'SABHYA DHIMAN', 2025, 5, '23BCS094@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS095', 'SACHIN CHOUDHARY', 2025, 5, '23BCS095@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS096', 'SAHIL TEKTA', 2025, 5, '23BCS096@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS097', 'SAINA SAINI', 2025, 5, '23BCS097@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS098', 'SAKSHAM CHHABRA', 2025, 5, '23BCS098@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS099', 'SAMAR KUMAR', 2025, 5, '23BCS099@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS100', 'SATVIK SRIVASTAVA', 2025, 5, '23BCS100@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS101', 'SAURABH CHAUDHARY', 2025, 5, '23BCS101@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS102', 'SAURAV YADAV', 2025, 5, '23BCS102@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS103', 'SAUREN SHARMA', 2025, 5, '23BCS103@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS104', 'SEJAL SHARMA', 2025, 5, '23BCS104@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS105', 'SHAGUN RANA', 2025, 5, '23BCS105@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS106', 'SHALINI KASHYAP', 2025, 5, '23BCS106@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS107', 'SHANPREET SINGH', 2025, 5, '23BCS107@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS108', 'SHIVANSH CHADHA', 2025, 5, '23BCS108@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS109', 'SHUBHAM ANAND', 2025, 5, '23BCS109@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS110', 'SOHAM JUNEJA', 2025, 5, '23BCS110@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS111', 'SRISHTI CHAMOLI', 2025, 5, '23BCS111@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS112', 'SUBHASH BHARTI', 2025, 5, '23BCS112@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS113', 'SUJAL CHOUDHARY', 2025, 5, '23BCS113@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS114', 'TANISHK SAINI', 2025, 5, '23BCS114@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS115', 'TANISHKA KHANDELWAL', 2025, 5, '23BCS115@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS116', 'TANISHQ CHAUDHARY', 2025, 5, '23BCS116@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS117', 'TANUSH', 2025, 5, '23BCS117@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS118', 'UJJAWAL MAHESHWARI', 2025, 5, '23BCS118@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS119', 'UMASHANKAR KUSHWAHA', 2025, 5, '23BCS119@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS120', 'URVASHI NANDAN DOHAREY', 2025, 5, '23BCS120@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS121', 'VANMA LEENASREE', 2025, 5, '23BCS121@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS122', 'VANSH PAL', 2025, 5, '23BCS122@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS123', 'VIR DAKSH KUMAR', 2025, 5, '23BCS123@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS124', 'VIRENDRA SAHU', 2025, 5, '23BCS124@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS125', 'BHAVYA MALIAKKAL BIJU', 2025, 5, '23BCS125@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS126', 'ABDUL HADI', 2025, 5, '23BCS126@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS127', 'AARYAN SEHGAL', 2025, 5, '23BCS127@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS128', 'SEJALPREET KAUR', 2025, 5, '23BCS128@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS129', 'SHRIYA CHAUDHARY', 2025, 5, '23BCS129@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS131', 'PRADYUMNA SHARMA KATTEL', 2025, 5, '23BCS131@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS132', 'MRA CHING SHWE', 2025, 5, '23BCS132@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS133', 'UJJWAL KUMAR', 2025, 5, '23BCS133@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS001', 'AASHISH', 2025, 7, '22BCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS002', 'AASHISH THAKUR', 2025, 7, '22BCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS003', 'ABHAY JAGGI', 2025, 7, '22BCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS004', 'ABHIJEET KUMAR', 2025, 7, '22BCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS005', 'ABHISHEK', 2025, 7, '22BCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS006', 'ABHISHEK BISHT', 2025, 7, '22BCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS007', 'ABHISHEK GODARA', 2025, 7, '22BCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS008', 'ABHISHEK KUMAR', 2025, 7, '22BCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS009', 'ABHISHEK SHARMA', 2025, 7, '22BCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS010', 'ADITYA CHAUDHARY', 2025, 7, '22BCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS011', 'AJAY BAIRWA', 2025, 7, '22BCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS012', 'AMAN GUPTA', 2025, 7, '22BCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS013', 'AMANDEEP SINGH PATHANIA', 2025, 7, '22BCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS014', 'AMARJEET KAUR', 2025, 7, '22BCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS015', 'AMIT KUMAR', 2025, 7, '22BCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS016', 'ANKUSH THAKUR', 2025, 7, '22BCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS017', 'ANTRIKSH KATNA', 2025, 7, '22BCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS018', 'ANUBHAV MISHRA', 2025, 7, '22BCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS019', 'ANUJA SINGH', 2025, 7, '22BCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS020', 'ANURAG NEGI', 2025, 7, '22BCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS021', 'ANUSH SAXENA', 2025, 7, '22BCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS022', 'APOORYA SINGH', 2025, 7, '22BCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS023', 'APURAV KUMAR', 2025, 7, '22BCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS024', 'ARNAV CHHABRA', 2025, 7, '22BCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS025', 'ARNAV GUPTA', 2025, 7, '22BCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS026', 'ARNAV SHARMA', 2025, 7, '22BCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS028', 'ARSHITA', 2025, 7, '22BCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS029', 'ARYAN RAGHAV', 2025, 7, '22BCS029@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS030', 'AVINASH SHARMA', 2025, 7, '22BCS030@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS031', 'AYUSH KAUSHAL', 2025, 7, '22BCS031@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS032', 'BHANU PRATAP RANA', 2025, 7, '22BCS032@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS033', 'CHEHAK MAKKAR', 2025, 7, '22BCS033@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS034', 'DEEPAK KUMAWAT', 2025, 7, '22BCS034@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS035', 'DEVENDRA SINGH DIDEL', 2025, 7, '22BCS035@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS036', 'DEVESH CHANDRA', 2025, 7, '22BCS036@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS037', 'DIKSHA', 2025, 7, '22BCS037@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS038', 'DIKSHANT KUMAWAT', 2025, 7, '22BCS038@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS039', 'DIVESH SINGH CHAUHAN', 2025, 7, '22BCS039@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS040', 'EKANSH MA HAJAN', 2025, 7, '22BCS040@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS041', 'GADADE KARTIK DATIATRAY', 2025, 7, '22BCS041@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS042', 'GYAN PRAKASH', 2025, 7, '22BCS042@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS043', 'HAMMAD HASHMI', 2025, 7, '22BCS043@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS044', 'HARSHIT', 2025, 7, '22BCS044@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS045', 'HEMPUSHP CHAUHAN', 2025, 7, '22BCS045@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS046', 'HIMANSHU GUPTA', 2025, 7, '22BCS046@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS047', 'HONEY RAJPUT', 2025, 7, '22BCS047@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS048', 'ISHA VASHISHT', 2025, 7, '228CS048@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS049', 'JATIN RAI', 2025, 7, '22BCS049@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS050', 'JAYANT KUMAR', 2025, 7, '22BCS050@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS051', 'JAYANT SHARMA', 2025, 7, '22BCS051@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS052', 'KANISH KDUTIA', 2025, 7, '22BCS052@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS053', 'KARAN CHOUDHARY', 2025, 7, '22BCS053@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS054', 'KARTIK VERMA', 2025, 7, '22BCS054@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS055', 'KATRAVATH HRUDAYAHUNA NAIK', 2025, 7, '22BCS055@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS056', 'KHUSHI SINGH', 2025, 7, '22BCS056@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS058', 'LAD HARSH KISHORE', 2025, 7, '22BCS058@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS059', 'LAKSHY AKANTIWAL', 2025, 7, '22BCS059@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS060', 'MALPANI YASHASVA', 2025, 7, '22BCS060@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS061', 'MANAN SHARMA', 2025, 7, '22BCS061@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS062', 'MANSI JOSHI', 2025, 7, '22BCS062@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS063', 'MOHD ARSH', 2025, 7, '22BCS063@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS064', 'MOHD FAIZAN', 2025, 7, '22BCS064@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS065', 'MONIKA KUMARI', 2025, 7, '22BCS065@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS066', 'NIKHIL SHARMA', 2025, 7, '22BCS066@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS068', 'PARAMVIR SINGH', 2025, 7, '22BCS068@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS069', 'PARAS DHIMAN', 2025, 7, '22BCS069@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS070', 'PARTH SAINI', 2025, 7, '22BCS070@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS071', 'PIYUSH GUPTA', 2025, 7, '22BCS071@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS072', 'PRAGYA ANWESHA', 2025, 7, '22BCS072@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS073', 'PRASHANT SATYAPRAKASH TRIPATHI', 2025, 7, '22BCS073@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS074', 'PRIKSHIT SAINI', 2025, 7, '22BCS074@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS075', 'PRINCE CHAUHAN', 2025, 7, '22BCS075@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS076', 'PRINCE JAISWAL', 2025, 7, '22BCS076@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS079', 'PRJYA RAJPUT', 2025, 7, '22BCS079@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS112', 'SUYASH JAISWAL', 2025, 7, '22BCS112@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS113', 'TANMAY SHARMA', 2025, 7, '22BCS113@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS114', 'TANUJA SHARMA', 2025, 7, '22BCS114@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS115', 'TARUN SHARMA', 2025, 7, '22BCS115@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS116', 'TEJA SWIRAI', 2025, 7, '22BCS116@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS117', 'TRIPTI', 2025, 7, '22BCS117@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS118', 'VIKAS KUMAR', 2025, 7, '22BCS118@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS119', 'VISHAKHA YADAV', 2025, 7, '22BCS119@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS120', 'YASHIT AARYA', 2025, 7, '22BCS120@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS121', 'YATIN', 2025, 7, '22BCS121@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS122', 'YOGESH SINGH RAJAWAT', 2025, 7, '22BCS122@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS123', 'YUVRAJ SINGH', 2025, 7, '22BCS123@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS125', 'LIPI RANI', 2025, 7, '22BCS125@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS126', 'MD.RAGIB NEAZ RAFSAN', 2025, 7, '22BCS126@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS127', 'RABEA MAZEN SALAH', 2025, 7, '22BCS127@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS128', 'SAARANSH SINGH RANA', 2025, 7, '22BCS128@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BEC032', 'ARYAN PURI', 2025, 7, '22BEC032@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22DCS025', 'SEEJAL SOOD', 2025, 7, '22DCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS001', 'AAKASH DUBB', 2025, 5, '23DCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS002', 'AANYA SINGH', 2025, 5, '23DCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS003', 'AKANKSHA KUMARI', 2025, 5, '23DCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS004', 'ANKUSH', 2025, 5, '23DCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS005', 'ANMOL SHARMA', 2025, 5, '23DCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS006', 'ARNAV SHARMA', 2025, 5, '23DCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS007', 'DIVYE VAIBHAV MISHRA', 2025, 5, '23DCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS008', 'ESHAN GARG', 2025, 5, '23DCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS009', 'HARDIK ANAND', 2025, 5, '23DCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS010', 'HARSH BHUSHAN', 2025, 5, '23DCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS011', 'HARSH GOEL', 2025, 5, '23DCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS012', 'HIMANSHU CHOUDHARY', 2025, 5, '23DCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS013', 'KANISH DHIMAN', 2025, 5, '23DCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS014', 'KANISHAK', 2025, 5, '23DCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS015', 'KASHISH CHOUDHARY', 2025, 5, '23DCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS019', 'MADDIPATLA POOJITH CHOWDARY', 2025, 5, '23DCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS020', 'NIKHIL PANTHI', 2025, 5, '23DCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS021', 'RAGHAV SHARMA', 2025, 5, '23DCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS022', 'SAHIL THAKUR', 2025, 5, '23DCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS023', 'SANJEEV KUMAR', 2025, 5, '23DCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS024', 'SARTHAK KATIYAR', 2025, 5, '23DCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS025', 'SEEMA SINGH', 2025, 5, '23DCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS026', 'SONAL DOGRA', 2025, 5, '23DCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS027', 'SUJAL CHOUHAN', 2025, 5, '23DCS027@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '23DCS028', 'VEDANSH THAKUR', 2025, 5, '23DCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS002', 'ANIRUDH SHARMA', 2025, 7, '22DCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS003', 'ANSHUL CHOUDHARY', 2025, 7, '22DCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS004', 'ARYAN', 2025, 7, '22DCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS005', 'AVISHEET SRIVASTAVA', 2025, 7, '22DCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS006', 'GOURIVENI SURYA BHAGAVAN', 2025, 7, '22DCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS007', 'GUNDRA ROHAN REDDY', 2025, 7, '22DCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS008', 'INDERJEET SINGH', 2025, 7, '22DCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS009', 'GLOSSY', 2025, 7, '22DCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS010', 'KIRTI SHARMA', 2025, 7, '22DCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS011', 'KRISHNA SINGH', 2025, 7, '22DCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS012', 'KUNAL', 2025, 7, '22DCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS013', 'NAVNEET', 2025, 7, '22DCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS014', 'PIYUSH SHARMA', 2025, 7, '22DCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS015', 'PRIYA CHAUHAN', 2025, 7, '22DCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS016', 'PRIYANSHU', 2025, 7, '22DCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS017', 'PRIYANSHU MISHRA', 2025, 7, '22DCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS018', 'PUSHPDEEP SINGH CHANDEL', 2025, 7, '22DCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS020', 'RISHABH RAJ', 2025, 7, '22DCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS021', 'SACHIT PARMAR', 2025, 7, '22DCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS022', 'SANJEEVEN', 2025, 7, '22DCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS023', 'SANKALP GUPTA', 2025, 7, '22DCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS024', 'SANYA GUPTA', 2025, 7, '22DCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS026', 'SHIBHU RATHORE', 2025, 7, '22DCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS027', 'SHREYA', 2025, 7, '22DCS027@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22BEE094', 'RITESH MISHRA', 2025, 7, '22BEE094@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS101', 'ABHISHEK ARVIND BADWAIK', 2025, 3, '24MCS101@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS102', 'PANCHAM SHARMA', 2025, 3, '24MCS102@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS103', 'POOJA MANOJ SHARMA', 2025, 3, '24MCS103@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS104', 'LAKSHYA KHARE', 2025, 3, '24MCS104@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS105', 'MANAS KUMAR MANNA', 2025, 3, '24MCS105@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS106', 'ARCHISH', 2025, 3, '24MCS106@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS107', 'RAJARAJESHWARI CHANDA', 2025, 3, '24MCS107@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS108', 'ANAND SINGH', 2025, 3, '24MCS108@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS110', 'SAPNA', 2025, 3, '24MCS110@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS111', 'AYUSH TRIVEDI', 2025, 3, '24MCS111@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS112', 'PAPPU SINGH KUSHWAHA', 2025, 3, '24MCS112@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS113', 'TAPAN PATIDAR', 2025, 3, '24MCS113@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS115', 'RAJESH KUMAR PAL', 2025, 3, '24MCS115@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS116', 'JANHAVI AJIT JADHAV', 2025, 3, '24MCS116@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS117', 'ROHIT KUMAR KUPPILI', 2025, 3, '24MCS117@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS118', 'HARIMOHAN ARYA', 2025, 3, '24MCS118@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS120', 'PRATEEK KAUSHAL', 2025, 3, '24MCS120@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS121', 'ANANYA SHARMA', 2025, 3, '24MCS121@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS122', 'ABHINAV VERMA', 2025, 3, '24MCS122@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS123', 'UMESH SINGH', 2025, 3, '24MCS123@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS124', 'NIKHIIL KUMAR RANA', 2025, 3, '24MCS124@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS001', 'NISHANT KALIYAR', 2025, 3, '24MCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS002', 'ANURAG MAHAR', 2025, 3, '24MCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS003', 'VISHAL SHARMA', 2025, 3, '24MCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS004', 'MRUNAL SHRIKANT KUMBHARE', 2025, 3, '24MCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS005', 'VISHALSINH ISHWARSINH SOLANKI', 2025, 3, '24MCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS006', 'GROVIN SINGH ATWAL', 2025, 3, '24MCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS007', 'SOUHARDYA DUTTA', 2025, 3, '24MCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS008', 'ARYAN KOURAV', 2025, 3, '24MCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS009', 'HIMANSHU KUMAR', 2025, 3, '24MCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS010', 'DEEPAK', 2025, 3, '24MCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS011', 'PRANJAL BAJPAI', 2025, 3, '24MCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS013', 'NITESH KUMAR', 2025, 3, '24MCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS014', 'MOHSIN ANSARI', 2025, 3, '24MCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS015', 'PRAVEEN KUMAR', 2025, 3, '24MCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS016', 'DEEPANSHU', 2025, 3, '24MCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS017', 'ANSHUL THAKUR', 2025, 3, '24MCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS019', 'SAHIL SHARMA', 2025, 3, '24MCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS020', 'NISHANT SHARMA', 2025, 3, '24MCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS021', 'PRINCE', 2025, 3, '24MCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS022', 'DIVYANSHU VERMA', 2025, 3, '24MCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS023', 'AYUSH YADAV', 2025, 3, '24MCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS024', 'RAJAT SANKHYAN', 2025, 3, '24MCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS025', 'ROHIT CHAUDHARY', 2025, 3, '24MCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '24MCS026', 'NITANSH', 2025, 3, '24MCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '24MCS109', 'JATIN', 2025, 3, '24MCS109@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS014', 'AKS KUMAR SINGH PATEL', 2025, 5, '23bcs014@nih.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '23BCS017', 'AKSHIT DOGRA', 2025, 5, '23BCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS001', 'ABHIMANYU SINGH', 2025, 7, '22DCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '22DCS028', 'SUMIT KUMAR', 2025, 7, '22DCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS077', 'PRINCE SHANDIL', 2025, 7, '22BCS077@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS078', 'PRITHIKA DATTA', 2025, 7, '22BCS078@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS080', 'PRJYANSHA SHARMA', 2025, 7, '22BCS080@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS081', 'PRIYANSHU SHARMA', 2025, 7, '22BCS081@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS082', 'PUSHPA SAINI', 2025, 7, '22BCS082@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS083', 'RAHUL KUMAR', 2025, 7, '22BCS083@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS084', 'RAJEEV SINGH SHEKHAWAT', 2025, 7, '22BCS084@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS085', 'RISHABH SURYAVANSHI', 2025, 7, '22BCS085@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS086', 'RISHAV RAJ', 2025, 7, '22BCS086@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS087', 'RITWIZ SINGH', 2025, 7, '22BCS087@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS088', 'RUDRANSH SINGH ATHWAL', 2025, 7, '22BCS088@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS089', 'RUPESH YADAV', 2025, 7, '22BCS089@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS090', 'SAGAR KAUNDAL', 2025, 7, '22BCS090@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS091', 'SAHILATRI', 2025, 7, '22BCS091@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS092', 'SAHIL DHIMAN', 2025, 7, '22BCS092@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS093', 'SAKSHAM CHAUHAN', 2025, 7, '22BCS093@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS094', 'SAKSHAM SALARIA', 2025, 7, '22BCS094@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS095', 'SAKSHI GOTHWAL', 2025, 7, '228CS095@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS096', 'SANDEEP YADAV', 2025, 7, '22BCS096@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS097', 'SANIYA ANAND', 2025, 7, '22BCS097@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS098', 'SARTHAK CHAUOHARY', 2025, 7, '22BCS098@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS099', 'SARTHAK PUNDIR', 2025, 7, '22BCS099@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS100', 'SHAMBHAVI', 2025, 7, '22BCS100@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS101', 'SHASHANT', 2025, 7, '22BCS101@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS102', 'SHESHANK', 2025, 7, '22BCS102@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS103', 'SHILPI GUTHALIA', 2025, 7, '22BCS103@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS104', 'SHIVAM', 2025, 7, '22BCS104@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS105', 'SHIVAM', 2025, 7, '22BCS105@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS106', 'SHREYA ANAND', 2025, 7, '22BCS106@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS107', 'SHRYANSH', 2025, 7, '22BCS107@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS108', 'SIDDI REDDY SAI SHASHANK REDDY', 2025, 7, '22BCS108@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS109', 'SOMENDRA AGGARWAL', 2025, 7, '22BCS109@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS110', 'SONTAKKE SRUJAN PRASHANT', 2025, 7, '22BCS110@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666661', '22BCS111', 'SUMJT SHARMA', 2025, 7, '22BCS111@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS001', 'TANMAY PATEL', 2025, 9, '21DCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS002', 'SAJAL BAJAJ', 2025, 9, '21DCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS003', 'AKASH SOAM', 2025, 9, '21DCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS004', 'SPRAHA SINGH', 2025, 9, '21DCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS005', 'VISHRUT THAKUR', 2025, 9, '21DCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS006', 'VARUN KAINTHLA', 2025, 9, '21DCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS007', 'AKSHANT VERMA', 2025, 9, '21DCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS008', 'AKARSHIT VERMA', 2025, 9, '21DCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS009', 'ANSHITA VERMA', 2025, 9, '21DCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS010', 'KOTA SATHVIK REDDY', 2025, 9, '21DCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS011', 'SHIVANSH DIXIT', 2025, 9, '21DCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS012', 'RITU MEHTA', 2025, 9, '21DCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS013', 'TUSHAR THAKUR', 2025, 9, '21DCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS014', 'PRIYANK RATHORE', 2025, 9, '21DCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS015', 'RAMESH KUMAR', 2025, 9, '21DCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS018', '��NILU KUMARI', 2025, 9, '21DCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS019', 'PRIYANK CHOUDHARY', 2025, 9, '21DCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS020', 'CHANCHAL BHARDWAJ', 2025, 9, '21DCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS021', 'VAISHALI THAKUR', 2025, 9, '21DCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS022', 'BHARGAV', 2025, 9, '21DCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS023', 'BADUGU AKSHITH', 2025, 9, '21DCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '210CS024', 'ASHISH KUMAR', 2025, 9, '210CS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS025', 'SHAHI', 2025, 9, '21DCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS026', 'SHUBHAM', 2025, 9, '21DCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS027', 'BRIJMOHAN KUMAR MAHTO', 2025, 9, '21DCS027@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS028', 'SHIVANI SHARMA', 2025, 9, '21DCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '21DCS029', 'FARHAT FIROZ', 2025, 9, '21DCS029@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS001', 'AAKRITI RATTAN', 2025, 3, '24DCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS002', 'AARAB', 2025, 3, '24DCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS003', 'AAYUSH RAJ', 2025, 3, '24DCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS004', 'ABHISHEK', 2025, 3, '24DCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS005', 'ADITYA KAUNDAL', 2025, 3, '24DCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS006', 'ADITYA NEGI', 2025, 3, '24DCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS007', 'ADITYA THAKUR', 2025, 3, '24DCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS008', 'BHAROTHU KARTHIK NAYAK', 2025, 3, '24DCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS009', 'GAVEN SHARMA', 2025, 3, '24DCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS010', 'HARSHITA', 2025, 3, '24DCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS011', 'JAY KUMAR NAGAR', 2025, 3, '24DCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS012', 'KRISHAN MAAN', 2025, 3, '24DCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS013', 'MRIDULA', 2025, 3, '24DCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS014', 'NIVESH PUROHIT', 2025, 3, '24DCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS015', 'PRASHANT KUMAR', 2025, 3, '24DCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS016', 'PRIYANSHU JAGOTRA', 2025, 3, '24DCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS017', 'RABIA BHARTI', 2025, 3, '24DCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS018', 'RAHUL VERMA', 2025, 3, '24DCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS019', 'RAVI KUMAYAN', 2025, 3, '24DCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS020', 'RIJUL RANGTA', 2025, 3, '24DCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS021', 'RUPAK RAKESH NAI', 2025, 3, '24DCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS022', 'RUPAL PATEL', 2025, 3, '24DCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS023', 'SAKSHAM VERMA', 2025, 3, '24DCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS024', 'SHLOK GOYAL', 2025, 3, '24DCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS025', 'SHUBHANSHU ARYA', 2025, 3, '24DCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS026', 'SUSHMIT NAKHATE', 2025, 3, '24DCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS027', 'VANSH VASHISHT', 2025, 3, '24DCS027@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS028', 'VANSHAJ GUPTA', 2025, 3, '24DCS028@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666663', '24DCS029', 'SHIFAN VADAKKUNGARA', 2025, 3, '24DCS029@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS103', 'Abhishek Rawat', 2025, 1, '25MCS103@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS104', 'Navadeep Reddy Rupireddy', 2025, 1, '25MCS104@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS105', 'Kartikeya Padaliya', 2025, 1, '25MCS105@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS106', 'Saurabh Mandal', 2025, 1, '25MCS106@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS107', 'Aditi Vijayvarqiya', 2025, 1, '25MCS107@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS108', 'Deeksha Yadav', 2025, 1, '25MCS108@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS109', 'Himanshu Dubey', 2025, 1, '25MCS109@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS110', 'Ashish Prajapati', 2025, 1, '25MCS110@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS111', 'Dharmender Pathania', 2025, 1, '25MCS111@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS112', 'Rana Harshini Paresh', 2025, 1, '25MCS112@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS113', 'Aaditya Bansode', 2025, 1, '25MCS113@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS114', 'Kunal Kumar', 2025, 1, '25MCS114@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS115', 'Dhawal Sudhir Kamble', 2025, 1, '25MCS115@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS116', 'Akash', 2025, 1, '25MCS116@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS117', 'Shiva Savita', 2025, 1, '25MCS117@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS118', 'Ashish Kumar', 2025, 1, '25MCS118@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS119', 'Manan Awasthi', 2025, 1, '25MCS119@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS120', 'Ayush Arya', 2025, 1, '25MCS120@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS121', 'Vaibhav Chauhan', 2025, 1, '25MCS121@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS122', 'Prasann Kumar', 2025, 1, '25MCS122@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS123', 'Anurag Thakur', 2025, 1, '25MCS123@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '25MCS101', 'Arshdeep Singh Boela', 2025, 1, '25MCS101@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '25MCS102', 'Dharmajit Baro', 2025, 1, '25MCS102@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '25MCS124', 'Anurag Thakur', 2025, 1, '25MCS124@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666665', '25MCS125', 'Anshaj Dharmani', 2025, 1, '25MCS125@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS001', 'Kunal Koushik', 2025, 1, '25MCS001@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS002', 'Nikhil Sharma', 2025, 1, '25MCS002@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS003', 'Mitrasen Yadav', 2025, 1, '25MCS003@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS004', 'Devesh Singh', 2025, 1, '25MCS004@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS005', 'Lade Ritish Rishi', 2025, 1, '25MCS005@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS006', 'Abhinav Sharma', 2025, 1, '25MCS006@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS007', 'Niket Brajesh Singh', 2025, 1, '25MCS007@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS008', 'Anuraj Koli', 2025, 1, '25MCS008@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS009', 'Anurag Singh', 2025, 1, '25MCS009@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS010', 'Aansh Mattoo', 2025, 1, '25MCS010@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS011', 'Dhiren Majhi', 2025, 1, '25MCS011@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS012', 'Kriti Sharma', 2025, 1, '25MCS012@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS013', 'Ashish Garg', 2025, 1, '25MCS013@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS014', 'Ajay Bind', 2025, 1, '25MCS014@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS015', 'Anindya Das', 2025, 1, '25MCS015@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS016', 'Devalapalli Sathwik', 2025, 1, '25MCS016@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS017', 'Nikesh Kumar', 2025, 1, '25MCS017@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS018', 'Badal Saini', 2025, 1, '25MCS018@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS019', 'Akshata Hanmantha Madiwal', 2025, 1, '25MCS019@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS020', 'Mohamed Ismail Abdi', 2025, 1, '25MCS020@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS021', 'Shubhangini Sharma', 2025, 1, '25MCS021@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS022', 'Anshul Thakur', 2025, 1, '25MCS022@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS023', 'Namrata', 2025, 1, '25MCS023@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS024', 'Samridhi Chauhan', 2025, 1, '25MCS024@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS025', 'Aditya', 2025, 1, '25MCS025@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
VALUES ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666662', '25MCS026', 'Kavita', 2025, 1, '25MCS026@nith.ac.in', '')
ON CONFLICT (department_id, admission_year, roll_number) WHERE deleted_at IS NULL DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

-- 17. PhD Scholars Registry
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ajay Guleria', '2K7-Ph.D.-CSE-96', 'Efficient Data Dissemination in Vehicular Ad-hoc Networks', 'Prof. Lalit Kumar Awasthi', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Siddhartha Chauhan', '2k6-Ph.D-CSE-08', 'Energy Efficient Data Gathering And Time Synchronization Protocols For Wireless Sensor Networks', 'Prof. Lalit Kumar Awasthi', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Rajeev Singh', '2k10-Ph.D-CSE-144', 'Enhancing Security in Wireless Local Area Networks', 'Dr. T.P. Sharma', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ashok Kumar Nanda', '2k9-Ph.D-CSE-131', 'Enhancing Security in Mobile Environment', 'Dr. Lalit Kumar Awasthi', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pushpender Kumar', '2k10-Ph.D-CSE-132', 'Efficient Data Dissemination in Wireless Multimedia Sensor Networks', 'Dr. Narottam Chand', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Priyanka Dadhich', '2k9-Ph.D-CSE-98', 'Trust Based Reputation for Securing Mobile Agent', 'Dr. Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Krishna Pal Sharma', '2K13-Ph.D-CSE-218', 'Minimizing Network Partitioning And Improving Data Availability In WSNs', 'Dr. T.P.Sharma', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Mukesh Kumar', '2K10-Ph.D-CSE-130', 'Secure Data Aggregation In Wireless Sensor Networks', 'Dr.Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Kulwardhan Singh', '2K10-Ph.D-CSE-168', 'Optimizing Route Discovery And Handling Mobility In Wireless Sensor Networks', 'Dr. T.P.Sharma', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pardeep Singh', '2K9-Ph.D-CSE-179', 'Anaphora Resolution In Hindi', 'Dr. Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Rajesh Sharma', '2K9-Ph.D-CSE-105', 'Energy Efficient Data Dissemination In Wireless Sensor Networks', 'Prof. Lalit Kumar Awasthi', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Brij Bihari Dubey', '2K13-Ph-D-CSE-220', 'Improving Data Availability In Vehicular Ad-Hoc Networks', 'Dr.Naveen Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Avtar Singh', '2K10-Ph.D-CSE-133', 'Resource Allocation In Cloud Computing', 'Dr. Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sunil Kumar', '2K10-Ph.D-CSE-166', 'Intrusion Detection Techniques for Mobile Adhoc Networks', 'Dr. Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Vipan Arora', '2K10-Ph.D-CSE-167', 'Reducing Inter-node Transmissions in a Wireless Sensor Network using Dynamic Sensing and Cooperative Caching', 'Dr. T.P.Sharma', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Arvind Dhaka', '2K15-Ph.D-CSE-295', 'Characterization and Statistical Optimization of Fading Impairments in a MIMO Channel', 'Dr. Siddhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Tajinder Singh', '2K14-Ph.D-CSE-267', 'Machine Learning Based Text Mining in Social Media', 'Dr.Madhu Kumari', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Prashant Kumar', '2k14-Ph.D-CSE-262', 'Resource Optimization in Opportunistic Networks', 'Dr. Naveen Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Gopal Chand Gautam', '2K13-Ph.D-CSE-205', 'Time Synchronization In Wireless Sensor Networks', 'Dr. Narottam Chand', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shashi Gurung', '2K14-Ph.D-CSE-274', 'Security in Mobile Ad-hoc Network', 'Dr. Siddhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Mohammad Ahsan', '2k15-Ph.D-CSE-294', 'Sentiment based Information Diffusion in Online Social Networks', 'Dr. T.P. Sharma', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Rajeev Kumar', '2K14-Ph.D.-CSE-266', 'Energy Efficient Operations in Wireless Sensor Networks', 'Dr. Narottam Chand', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Anamika Sharma', '2K14-Ph.D-CSE-264', 'Intrusion Detection in Wireless Sensor Networks', 'Dr. Siddhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Deepshikha', '2K14-Ph.D-CSE-265', 'Futuristic Remote Healthcare Techniques for Body Areas Networks', 'Dr. Siddhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Piyush Rawat', '2K18-Ph.D.-CSE-398', 'Energy Efficient Protocols to Maximize the Lifetime of Wireless Sensor Networks', 'Dr. Siddhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Richa', '2k17-Ph.D-CSE-341', 'Dynamic and Fault Tolerant Topology for Efficient Data Dissemination in Internet of Vehicles', 'Dr. T.P. Sharma', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Kusum Lata', '2K17-Ph.D.-CSE-339', 'Coreference Resolution For Hindi Language Text Using Deep Learning', 'Supervisor', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Nilanshi Chauhan', '2k17-Ph.D-CSE-361', 'Energy Efficient Coverage Techniques for Maximizing the WSN Lifetime', 'Dr. Siddhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Parnika Bhat', '2k17-Ph.D-CSE-340', 'Malware Detection for Android in Static and Dynamic Environment', 'Dr. Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Triveni Lal Pal', '2k17-Ph.D-CSE-263', 'Enhancing Semantic Representation of Long Word Sequence Embeddings Using Neural Network Techniques', 'Dr. Kamlesh Dutta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Tarun Agrawal', '2K19-Ph.D.-CSE-463', 'Classification and Segmentation of Chest Radiography Images Using Deep Convolutional Neural Network', 'Dr. Prakash Choudhary', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'K Susheel Kumar', '2K19-Ph.D.-CSE-470', 'Development of Efficient Approaches for the Extraction of Retinal Blood Vessel Structure and Disease Prediction', 'Dr. Nagendra Pratap Singh', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Tanuj Wala', '2K17-Ph.D.-CSE-338', 'Efficient Handling of Big Data in Internet of Things', 'Dr. Rajeev Kumar', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Nishant Sharma', '2K15-Ph.D.-CSE-298', 'Improving Data Availability in Internet of Vehicles', 'Dr. Naveen Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shobhit Tyagi', '2K19-Ph.D.-CSE-462', 'Deep Learning Based Approaches for Fake Image Detection', 'Dr. Divakar Yadav', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Radha Rani', '2K19-Ph.D.-CSE-466', 'Wait-Free Consensus Problem in Distributed Computing', 'Dr. Dharmendra Prasad Mahato', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Yogendra Kumar', '2K19-Ph.D.-CSE-469', 'Enhancing the Performance of Intrusion Detection System Frameworks Using Computational Intelligence Techniques', 'Dr. Vijay Chahar', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sreenu', '2K19-Ph.D.-CSE-472', 'A Novel Resilient and Responsive Pharmaceutical Supply Chain through Blockchain and Artificial Intelligence', 'Dr. Nitin Gupta', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Namrata Kumari', '2K18-Ph.D.-CSE-396', 'Hindi Text Summarization using Meta-Heuristic Approach and Neural Network', 'Dr. Pardeep Singh', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pranjal', '2K19-Ph.D-CSE-468', 'Human activity recognition using deep learning models', 'Dr. Sidhartha Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Deepa Rani', '21RCS003', 'Energy Efficient and Secure Framework for IoT based Healthcare', 'Dr. Rajeev Kumar', 'passed', 'deepa_phd_cse@nith.ac.in', '6/28/2024 13:02:28');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'AKASH VERMA', '22RCS006', 'Deep Learning based Brain tumor Segmentation and classification from MRI IMages', 'Dr. ARUN KUMAR YADAV', 'passed', 'akash_phdcse@nith.ac.in', '6/28/2024 13:56:51');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Aschalew Tirulo Abiko', '21RCS002', 'Artificial Intelligence- Driven Detection and Mitigation of Cyberattacks in IoT- Enabled Smart Grids', 'Prof.Siddharth Chauhan', 'passed', 'aschalew@nith.ac.in', '6/28/2024 14:04:07');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Smriti guleria', '', '', 'Dr .Nitin gupta', 'pursuing', '24rcs005@nith.ac.in', '6/28/2024 14:17:51');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Samridhi Singh', '22RCS005', '', 'Dr. Rajeev Kumar', 'passed', '22rcs005@nith.ac.in', '6/28/2024 15:10:44');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ranjeet Chaudhary', '', '', 'Dr. Mohit Kumar', 'pursuing', '24rcs002@nith.ac.in', '6/28/2024 15:12:50');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Geetanjali', '', '', 'Dr. Mohit Kumar', 'pursuing', 'gtnjlthkr@gmail.com', '6/28/2024 15:31:22');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Md. Ataullah', '', '', 'Dr. Naveen Chauhan', 'pursuing', '23rcs001@nith.ac.in', '6/28/2024 15:32:44');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Subeesh A', '', '', 'Dr. Naveen Chauhan', 'pursuing', 'subeesh_phdcse@nith.ac.in', '6/28/2024 15:33:16');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Divya Jyoti', '', '', 'Dr. jyoti Srivastava', 'pursuing', 'divya_phdcse@nith.ac.in', '6/28/2024 15:48:18');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ishana Attri', '21RCS004', 'Deep Learning bases Framework for Early Detection of Diseases in essential Crops', 'Prof. Lalit Kumar Awasthi and Dr T.P Sharma', 'passed', 'ishana_phdcse@nith.ac.in', '6/28/2024 15:53:06');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Garima Thakur', '', '', 'Dr. Jyoti Srivastava', 'pursuing', '24rcs009@nith.ac.in', '6/28/2024 16:06:08');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'ANKIT VERMA', '', '', 'Dr. T.P. SHARMA', 'pursuing', 'ankitv@nith.ac.in', '6/28/2024 16:17:30');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pankaj Singh Jamwal', '', '', 'Dr. Jyoti Srivastava', 'pursuing', '25rcs005@nith.ac.in', '07/01/2024 10:40');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Kuldeep Singh Jadon', '', '', 'Dr Nitin Gupta', 'pursuing', 'kuldeep_phdcse@nith.ac.in', '07/01/2024 16:34');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Praveen Prakash', '', '', 'Dr. Priyanka', 'pursuing', 'praveen_phdcse@nith.ac.in', '07/01/2024 17:37');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pooja Rani', '20RCS002', 'Drug Synergy Prediction using Deep Learning Techniques', 'Dr. Kamlesh Dutta', 'passed', 'pooja_phdcse@nith.ac.in', '10/8/2024 11:36:50');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Neha Sharma', '24RCS014', '', 'Dr. Mohit Kumar', 'pursuing', '24rcs014@nith.ac.in', '10/8/2024 12:30:33');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'DIPTI SHARMA', '24rcs010', '', 'Dr. Naveen Chauhan', 'pursuing', '24rcs010@nith.ac.in', '10/8/2024 15:24:19');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Amisha Gupta', '24rcs011', '', 'Dr. Dharmendra Prasad Mahato', 'pursuing', '24rcs011@nith.ac.in', '10/8/2024 16:10:07');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Himanshu Kumar', '23RCS002', '', 'Dr. Kamlesh Dutta', 'pursuing', '23rcs002@nith.ac.in', '10/8/2024 16:49:41');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'VISHNU KUMAR PRAJAPATI', '2k19-PHD_CSE-471', '', 'Dr. T. P. Sharma', 'passed', 'vishnu08jec@gmail.com', '10/8/2024 17:08:25');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shubhkirti Sharma', '2K19-Ph.D.CSE-464', 'Detection of Multi-Objective Opmization Algorithm for Engineering Problems', 'Dr Vijay Kumar', 'passed', 'shubhkirti@nith.ac.in', '10/8/2024 17:12:21');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Mohammad Azeem', '24RCS007', '', 'Dr. Dharmendra Prasad Mahato', 'pursuing', '24rcs007@nith.ac.in', '10/8/2024 19:08:47');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ritika Verma', '24rcs001', '', 'Dr Dharmendra Prasad Mahato', 'pursuing', '24rcs001@nith.ac.in', '10/9/2024 12:19:51');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Vishal Kaushal', '2K20-PHD-CSE-514', '', 'Dr. Sangeeta Sharma', 'passed', 'vishal_phdcse@nith.ac.in', '10/14/2024 18:00:51');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sourav Mondal', '21RCS005', '', 'Dr. Priyanka', 'pursuing', 'sourav_phdcse@nith.ac.in', '10/14/2024 19:11:45');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Bhanu Pratap Singh', '24rcs012', '', 'Dr. Sangeeta Sharma', 'pursuing', '24rcs012@nith.ac.in', '10/15/2024 12:25:54');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Poonam Kashtriya', '2k19-phd-cse-467', '', 'Dr. Pardeep Singh', 'pursuing', 'poonam_phdcse@nith.ac.in', '10/15/2024 17:26:41');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Vandana', '24rcs004', '', 'Dr. Arun Kumar Yadav', 'pursuing', '24rcs004@nith.ac.in', '10/15/2024 17:33:35');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Vikas Kashtriya', '20RCS006', '', 'Dr. Pardeep Singh', 'pursuing', 'vikas_phdcse@nith.ac.in', '10/15/2024 17:33:56');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Azmera Chandu Naik', '21RCS006', '', 'Prof. Lalith Kumar Awasthi', 'pursuing', 'azmeera_phdcse@nith.ac.in', '10/15/2024 17:59:06');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ramakrishna Miryala', '24RCS003', '', 'Dr.(Mrs.) Kamlesh Dutta', 'pursuing', '24rcs003@nith.ac.in', '10/16/2024 9:55:26');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shyam', '24Rcs013', '', 'Dr. Pradeep Singh', 'pursuing', '24RCS013@nith.ac.in', '10/16/2024 16:03:19');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Rakhi', '20RCS004', '', 'Dr T. P.Sharma', 'pursuing', 'Rakhi_phdcse@nith.ac.in', '10/17/2024 0:48:22');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Devender Singh Daila', '22RCS001', '', 'Dr. Rajeev Kumar', 'pursuing', 'devender_phdcse@nith.ac.in', '10/17/2024 15:00:30');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'SATISH CHANDER SHARMA', '23RCS005', '', 'Dr. Dharmendra Prasad Mahato', 'pursuing', 'scsid12@gmail.com', '10/17/2024 17:15:38');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Chetan Agarwal', '2K18_PhD_CSE-397', '', 'Dr. Kamlesh Dutta', 'pursuing', 'chetanswadeshi@gmail.com', '10/21/2024 11:07:47');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Mohit Kaushal', '', '', 'Dr. Mohammad Khalid Pandit', 'pursuing', '25rcs008@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Tamana', '', '', 'Dr. TP Sharma', 'pursuing', '25rcs004@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pranit Verma', '', '', 'Dr. TP Sharma', 'pursuing', '25rcs002@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shorav Verma', '', '', 'Dr. Ajay Kumar Mallick', 'pursuing', '25rcs010@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ashutosh Sharma', '', '', 'Dr. Ram Prakash Sharma', 'pursuing', '25rcs001@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Aanchal Bhandari', '', '', 'Dr. Naveen Chauhan', 'pursuing', '25rcs003@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Robin mongra', '', '', 'Dr. Siddhartha Chauhan', 'pursuing', '25rcs007@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Abhishek Sharma', '', '', 'Dr. Preeti Soni', 'pursuing', '25rcs009@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Simran', '', '', 'Dr. Nitin Gupta', 'pursuing', '25rcs017@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sushma Kumari', '', '', 'Dr. Priyanka', 'pursuing', '25rcs015@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pushpender Bhardwaj', '', '', 'Dr. Rajeev Kumar', 'pursuing', '25rcs013@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Gauri Thakur', '', '', 'Dr. Kamlesh Dutta', 'pursuing', '25rcs016@nith.ac.in', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Himanshu Verma', '2K19-PHD-CSE-465', '', 'Dr. Naveen Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'R Manjula', '20RCS005', '', 'Dr. Naveen Chauhan', 'passed', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ashok Kumar Kashyap', '', '', 'Dr. Robin Singh Bhadoria', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sachin Jain', '', '', 'Dr. Jyoti Srivastava', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Manish Kumar', '', '', 'Dr. Arun Kumar Yadav', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shivani', '', '', 'Dr. Rajeev Kumar', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Hemesh Bhardwaj', '', '', 'Dr. Arun Kumar Yadav', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Vatika Jalali', '', '', 'Dr. Siddhartha Chauhan', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Gurpreet Singh', '', '', 'Dr. Rajeev Kumar', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Akriti Jaswal', '', '', 'Dr. Pardeep Singh', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Bhaskar Bhardwaj', '', '', 'Dr. Ram Prakash Sharma', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Palak Shandil', '', '', 'Dr. Siddhartha Chauhan', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Saurav Paul', '', '', 'Dr. Sangeeta Sharma', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Raghav Sharma', '', '', 'Dr. Robin Singh Bhadoria', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Shveta', '', '', 'Dr. Robin Singh Bhadoria', 'pursuing', '', '');
INSERT INTO phd_scholars (department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Umeshwar Singhg', '', '', 'Dr. Robin Singh Bhadoria', 'pursuing', '', '');

-- 18. Staff Registry
INSERT INTO staff (department_id, full_name, designation, email, phone, photo_url, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'ANURAG DHIMAN', 'TECHNICIAN', 'anuragd@nith.ac.in', '7889075826', 'https://res.cloudinary.com/dha8atrgz/image/upload/v1722102504/289599C8-3365-4180-B5F0-D17ED36A6243_-_Mr._Anurag_Dhiman_bem8gs.jpg', '');
INSERT INTO staff (department_id, full_name, designation, email, phone, photo_url, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Piyush Pathania', 'Junior Assistant', 'piyush@nith.ac.in', '9149598033', 'https://res.cloudinary.com/dha8atrgz/image/upload/v1722102594/IMG_20210506_132421_copy_212x292_-_Piyush_Pathania_pvhfef.jpg', '');
INSERT INTO staff (department_id, full_name, designation, email, phone, photo_url, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Jiwan kumar', 'Technician SG II', 'jiwannit@gmail.com', '8894961433', 'https://res.cloudinary.com/dha8atrgz/image/upload/v1722102643/jeevan_sir_cse_-_Jiwan_Kumar_pfn3qt.jpg', '');
INSERT INTO staff (department_id, full_name, designation, email, phone, photo_url, time_note)
VALUES ('22222222-2222-2222-2222-222222222222', 'Sanjeev Kumar Thakur', 'Technical Assistant SG-I', 'sanjeev@nith.ac.in', '', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1744802170/eml63kocxmmelbpw5c4v.jpg', '');

-- 19. Labs & Equipment
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'H P Laser Printer M 208 DW', 6, 231, 9073455.00, '2022-11-30', 'Luxmi Enterprises', 'LE/43372', 'Dr.Arun Kumar Yadav', 'SCO 13-14,Sec-19C Chandigarh-160019 Mob 9872018223');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Xerox Versalink MFM B7125', 1, 231, 146271.00, '2023-01-30', 'Satluj Document Company', 'SDC/202223/2948', 'Dr. Prakash Chaudhary', '2nd Floor,Saligram Bhawan,Khalini Shimla-171002 Mob 9418029306');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Xerox Versalink C7025', 1, 231, 249792.46, '2023-01-30', 'Satluj Document Company', 'SDC/202223/2947', 'Dr. Prakash Chaudhary', '2nd Floor,Saligram Bhawan,Khalini Shimla-171002 Mob 9418029306');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'H.P. Monitor HP P22V G4 9TT 53A7', 1, 232, 12900.00, '2023-03-24', 'Satluj Document Company', 'SDC/202223/3771', 'Dr. Nitin Gupta', '"Satluj Bhawan plot No-448 Lane 16 Sec-4,New shimla-171009 Mob 9418011872"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Matlab R2023a(Software)', 1, 232, 3932377.00, '2023-03-27', 'Design Tech System Pvt.Ltd.', 'MHI/2223/50518', 'Dr.Arun Kumar Yadav', 'Shop No.2 ""Dyananda"",Post Bhugaon Tal.Hulshi,Distt.Pune-412115(MH) Mob +91-2041311200');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', '"Electronic Lectren Windows 10 PC with Monitorized lift LED Screen "', 1, 232, 459800.00, '2023-03-27', 'Technova Solutions', 'GST-45', 'Dr.Mohit Kumar', '"SCO -172,SEC-38 C Chandigarh 160026 Landline-01725051909 Mob-9915949909"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Audio System, Amplifier,DSP,Wireless Mic,Wall Speakers', 1, 232, 371755.00, '2023-03-20', 'Technova Solutions', '"TIN-04960040297 GST-43"', 'Dr.Mohit Kumar', '"SCO -172,SEC-38 C Chandigarh 160026 Landline-01725051909 Mob-9915949909"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'P.C', 15, 236, 1035525.00, '2023-08-18', 'Store', 'SDC/202324/1421', '', 'M/S Satluj Document Company');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', '"Furniture a) Master Chairs b) Visitor Chairs c) Computer Chairs"', 63, 236, 249385.75, '2023-10-06', 'Store', 'GST/3207', '', '"RFH Solutions Pvt.Ltd. SCF-3 & 9,Shaheed Udham Singh Nagar, Jalandhar,Punjab Ph.5094869"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Window Blinds', 9, 236, 213302.00, '2023-12-21', 'Greenish Decor', 'GST/1569', 'Dr.Mohit Kumar', '"Plot No 136-140/92,Industrial Area, Phase 1,Chandigarh 160002 Mob 9815218357"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Desktop', 30, 233, 1627200.00, '2024-04-20', 'Arihant Enterprise', 'AE/IT/2425/062', 'Dr. Nitin Gupta', 'Arihant Enterprise, Gujarat, 9081006644');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Interactive Panel 86"', 1, 234, 167499.00, '2024-04-20', 'Store', 'SDC/202425/0121', 'Dr. Mohit Kumar', 'Mob. No.-7018931990');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Interactive Panel 75"', 2, 234, 293080.00, '2024-04-20', 'Store', 'SDC/202425/0121', 'Dr. Mohit Kumar', 'Mob. No.-7018931990');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Projector', 3, 234, 173397.00, '2024-04-20', 'Store', 'SDC/202425/0121', 'Dr. Mohit Kumar', 'Mob. No.-7018931990');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', '"Furniture a) Computer Chair b) Conference Table c) Conference Revolving Chair d) Study Cubical Table e) Study Chair f) Book Shelf g) Almirah h) Master Chair i) Visitor Chair"', 205, 112, 1691613.00, '2024-08-27', '"R Son Furniture Udyog"', '7014', '"Dr. Ajay Kumar Mallick & Dr. R.S. Bhadoriya"', '"Rani ki Bain P.O. Gutkar, Distt. Mandi Mob. No.: 9418004040 9736700004"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Printer', 6, 235, 101281.98, '2024-10-11', '"M/s Himtech Image Solution Shimla"', 'GEM-48932634', 'Dr. Ram Parkash Sharma', '"M/s Himtech Image Solution Shimla"');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'A.C.', 10, 237, 639000.00, '2024-11-13', 'M. N. Agencies', 'GEM-50171860', '"Dr. A. K. Mallick/ Dr. Sangeeta Sharma Dr. M. K. Pandit/ Dr. Preeti Soni"', '"Shop no. 6 Reliable Business Centre, Bank Street, ABIDS Opp. Sidhartha Hotel, Hyderabad, Telangana Mob. No. 9849132891"""');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', '"Furniture a) Executive Table b) Executive Chair c) Computer Chair d) Computer Table e) Visitor Chaie"', 48, 118, 397932.06, '2025-01-08', '"M/S R Son Furniture Udyog, Mandi"', '"GEMC-511687750313313 dated 25/11/2024"', 'Dr. Mohammad Khalid', '');
INSERT INTO equipment (department_id, name, quantity, stock_in_use, purchase_value, purchase_date, vendor_name, invoice_number, indenter_name, contact_details)
VALUES ('22222222-2222-2222-2222-222222222222', 'Desktop', 100, 239, 7771695.00, '2025-02-01', 'Alakh Infotech', '"GEMC-511687702683677 dated 12/12/2024"', 'Dr. Arun Kumar Yadav/ Dr. Mohit Kumar', '"Shop No. 43, Ist Floor Sarpanch Complex, Badheri Sec. 41-D Chandigarh Mob. No. 9781804530 & 9781524240"');

-- 20. Placement Stats

-- 21. Announcements & Posts
INSERT INTO announcements (department_id, title, body, publish_date, is_private)
VALUES ('22222222-2222-2222-2222-222222222222', 'Department of CSE, NIT Hamirpur is organizing two days International conference on Artificial intelligence, Machine Learning and Intelligent Syatems (ICAMS-2025) from 07-08 Februrary 2025.', 'https://sites.google.com/nith.ac.in/icams2025', CURRENT_DATE, FALSE);
INSERT INTO announcements (department_id, title, body, publish_date, is_private)
VALUES ('22222222-2222-2222-2222-222222222222', 'Department of CSE has proposed a new Course Curriculum for M.Tech CSE, M.Tech AI, and Dual Degree (B.Tech & M.Tech) w.e.f. Academic Session 2024-25', '', CURRENT_DATE, FALSE);
INSERT INTO announcements (department_id, title, body, publish_date, is_private)
VALUES ('22222222-2222-2222-2222-222222222222', 'Department of CSE has proposed a new Course Curriculum as per NEP-2020 for B.Tech in Computer Science and Engineering w.e.f. Academic Session 2024-25', 'https://nith.ac.in/uploads/topics/new-nep-cse-syllabus17222307132912.pdf', CURRENT_DATE, FALSE);
INSERT INTO announcements (department_id, title, body, publish_date, is_private)
VALUES ('22222222-2222-2222-2222-222222222222', 'Department of CSE has proposed a Minor Degree Programme in Computer Science and Engineering as per NEP w.e.f. Academic Session 2024-25', 'https://nith.ac.in/uploads/topics/syllabus-cse-minor-degree17216260326071.pdf', CURRENT_DATE, FALSE);
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', '5th International Conference on Machine Learning, Image Processing, Network Security, and Data Sciences (MIND 2023)', 'Department of CSE, NIT Hamirpur has successfully orgainized 5th International Conference on Machine Learning, Image Processing, Network Security, and Data Sciences (MIND 2023) on 21st and 22nd of December 2023', '2024-09-06');
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', 'Recent Advancements in Artificial Intelligence and Internet of Things (RAAI-2024)', 'Department of CSE, NIT Hamirpur has successfully orgainized 5 Days e-Workshop on Recent Advancements in Artificial Intelligence and Internet of Things (RAAI-2024) from 08-12 April 2024', '2024-09-06');
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', 'Research Applications of Deep Learning', 'Department of CSE, NIT Hamirpur has successfully orgainized 5 Days e-STC on Research Applications of Deep Learning from 01-05 July 2024', '2025-06-04');
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', '2nd International Conference on Artificial Intelligence, Machine Learning & Intelligent Systems (ICAMS-2025)', 'The 2nd International Conference on Artificial Intelligence, Machine Learning & Intelligent Systems (ICAMS 2025) was scheduled on February 7–8, 2025, at the National Institute of Technology (NIT) Hamirpur, Himachal Pradesh, India. Organized by the Department of Computer Science and Engineering at NIT Hamirpur. The Organising Chairman is Dr. Naveen Chauhan, DoCSE, NIT Hamirpur. The Organising Secretary is Dr. Mohammad Khalid Pradit and Dr. Ajay Kumar Mallick, DoCSE, NIT Hamirpur. The inaugural ceremony of ICAMS 2025 was held on February 7, 2025, at the National Institute of Technology (NIT) Hamirpur in presence of Prof. Hiralal Murlidhar Suryawanshi, Director of NIT Hamirpur, Prof. Archana Santosh Nanoty, Registrar, NIT Hamirpur, and other expert from reputed institutes. The Valedictory Ceremony of the ICAMS 2025 was held on 8th February 2025 at NIT Hamirpur, marking the successful conclusion of the two-day conference in the esteemed presence of Prof. H.M. Suryawanshi, Director, NIT Hamirpur, Prof. Archana Santosh Nanoty, Registrar and other delegates.', '2025-06-13');
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', 'e-STC ON Mobile Device Security during 27-31 January 2025', 'The primary objective of this short-term course is to equip participants with in-depth understanding of the latest trends and advancements in the field of Mobile Device Security. This short-term course aims to provide insights into advancements in mobile and wireless security. Key topics include reconnaissance, 5G security, malware analysis, cryptography, and machine learning applications. Participants will also explore opportunistic networks, device-to-device communication, and attack graphs. Led by experts, the course equips professionals and researchers with skills to address modern cybersecurity challenges.', '2025-06-10');
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', 'Faculty Updation Programme on Mobile Device Security during 24-28 Feb-2025', 'The aims this event is to enhance faculty and researchers'' knowledge and skills in mobile device security, addressing both current challenges and technological advancements. It focuses on practical training in security technologies, experiments, and simulations, while fostering collaboration to tackle industrial and research challenges in network and information security.', '2025-06-10');
INSERT INTO posts (department_id, category, title, body, publish_date)
VALUES ('22222222-2222-2222-2222-222222222222', 'achievement', 'Bootcamp On Mobile Device Security during 6-7 March 2025', 'This intensive bootcamp offers a comprehensive introduction to key areas in mobile and AI security. Participants will gain foundational knowledge in mobile security, explore recent mobile attack techniques, and learn practical skills like reverse engineering Android apps and performing mobile forensics. The bootcamp also delves into critical aspects of AI safety, including the causes and risks of LLM hallucinations, and methods to ensure trust and reliability in large language models. Designed for cybersecurity enthusiasts, developers, and researchers, the program blends hands-on learning with real-world case studies to build expertise in securing modern mobile and AI systems.', '2025-06-10');

-- 22. About Sections, HOD Message & Home Slides
INSERT INTO hod_messages (department_id, hod_name, message, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'Dr. Siddhartha Chauhan', 'It is with great pleasure that I write this in the capacity of the Head of the Department (HOD) of the Computer Science and Engineering (CSE) Department at NIT Hamirpur. I thank all the faculty members, students, and staff of our esteemed department for their continuous efforts every day in maintaining the excellence and reputation of our department', 'https://portfolios.nith.ac.in/uploads/member_details/62.jpg');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dtxjhtjv2/image/upload/v1726560953/1_vrhhbu.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dtxjhtjv2/image/upload/v1726560951/2_olfa2q.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dtxjhtjv2/image/upload/v1727629275/Departmental-Website-Inauguration_1_wxnswg.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749013579/luoszkppvjhxboiettqs.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749013596/qforn6yvutj2lquzltif.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749013611/pd0v4cmnhjgixissttgl.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749013697/uzflivcqzwx5zowzusbv.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749013709/gva8oahffjnnhrxy1yjj.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749211054/z3hutohh0p6xro1vp7qm.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749468582/hpz76jipbtrc2zxrhzzh.png');
INSERT INTO home_slides (department_id, image_url)
VALUES ('22222222-2222-2222-2222-222222222222', 'https://res.cloudinary.com/dvnrlqqpq/image/upload/v1749468653/snbuwfwxpplfftowidmh.png');

-- 23. Refresh Materialized Views
REFRESH MATERIALIZED VIEW v_faculty_kpis;
REFRESH MATERIALIZED VIEW v_department_kpis;
REFRESH MATERIALIZED VIEW v_institute_kpis;

COMMIT;