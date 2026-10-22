-- =============================================
-- WordSnap Game - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Create vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id SERIAL PRIMARY KEY,
  abbreviation TEXT NOT NULL,
  full_form TEXT NOT NULL,
  description_th TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hardware', 'software', 'networking', 'programming')),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL CHECK (mode IN ('abbreviation', 'definition', 'speed')),
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  max_streak INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX idx_vocabulary_category ON vocabulary(category);
CREATE INDEX idx_vocabulary_difficulty ON vocabulary(difficulty);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_mode ON leaderboard(mode);
CREATE INDEX idx_leaderboard_created ON leaderboard(created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - Allow public read for vocabulary
CREATE POLICY "Allow public read vocabulary" ON vocabulary
  FOR SELECT USING (true);

-- 6. RLS Policies - Allow public read/insert for leaderboard
CREATE POLICY "Allow public read leaderboard" ON leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert leaderboard" ON leaderboard
  FOR INSERT WITH CHECK (true);

-- =============================================
-- SEED DATA: Hardware (55 terms)
-- =============================================
INSERT INTO vocabulary (abbreviation, full_form, description_th, category, difficulty) VALUES
('CPU', 'Central Processing Unit', 'หน่วยประมวลผลกลาง', 'hardware', 'easy'),
('GPU', 'Graphics Processing Unit', 'หน่วยประมวลผลกราฟิก', 'hardware', 'easy'),
('RAM', 'Random Access Memory', 'หน่วยความจำเข้าถึงโดยสุ่ม', 'hardware', 'easy'),
('ROM', 'Read Only Memory', 'หน่วยความจำอ่านอย่างเดียว', 'hardware', 'easy'),
('SSD', 'Solid State Drive', 'ไดรฟ์แบบโซลิดสเตท', 'hardware', 'easy'),
('HDD', 'Hard Disk Drive', 'ฮาร์ดดิสก์ไดรฟ์', 'hardware', 'easy'),
('PSU', 'Power Supply Unit', 'หน่วยจ่ายไฟ', 'hardware', 'easy'),
('USB', 'Universal Serial Bus', 'บัสอนุกรมสากล', 'hardware', 'easy'),
('LED', 'Light Emitting Diode', 'ไดโอดเปล่งแสง', 'hardware', 'easy'),
('LCD', 'Liquid Crystal Display', 'จอแสดงผลผลึกเหลว', 'hardware', 'easy'),
('UPS', 'Uninterruptible Power Supply', 'เครื่องสำรองไฟ', 'hardware', 'easy'),
('VGA', 'Video Graphics Array', 'อาเรย์กราฟิกวิดีโอ', 'hardware', 'medium'),
('HDMI', 'High Definition Multimedia Interface', 'อินเตอร์เฟสมัลติมีเดียความละเอียดสูง', 'hardware', 'medium'),
('NIC', 'Network Interface Card', 'การ์ดเชื่อมต่อเครือข่าย', 'hardware', 'medium'),
('BIOS', 'Basic Input Output System', 'ระบบอินพุตเอาต์พุตพื้นฐาน', 'hardware', 'medium'),
('CMOS', 'Complementary Metal Oxide Semiconductor', 'เซมิคอนดักเตอร์โลหะออกไซด์เสริม', 'hardware', 'medium'),
('ALU', 'Arithmetic Logic Unit', 'หน่วยคำนวณและตรรกะ', 'hardware', 'medium'),
('DVI', 'Digital Visual Interface', 'อินเตอร์เฟสภาพดิจิทัล', 'hardware', 'medium'),
('SATA', 'Serial Advanced Technology Attachment', 'การเชื่อมต่อเทคโนโลยีขั้นสูงแบบอนุกรม', 'hardware', 'medium'),
('RAID', 'Redundant Array of Independent Disks', 'อาเรย์สำรองของดิสก์อิสระ', 'hardware', 'medium'),
('CRT', 'Cathode Ray Tube', 'หลอดรังสีแคโทด', 'hardware', 'medium'),
('OLED', 'Organic Light Emitting Diode', 'ไดโอดเปล่งแสงอินทรีย์', 'hardware', 'medium'),
('DRAM', 'Dynamic Random Access Memory', 'หน่วยความจำเข้าถึงสุ่มแบบไดนามิก', 'hardware', 'medium'),
('SRAM', 'Static Random Access Memory', 'หน่วยความจำเข้าถึงสุ่มแบบสแตติก', 'hardware', 'medium'),
('VRAM', 'Video Random Access Memory', 'หน่วยความจำวิดีโอ', 'hardware', 'medium'),
('DMA', 'Direct Memory Access', 'การเข้าถึงหน่วยความจำโดยตรง', 'hardware', 'medium'),
('DAC', 'Digital to Analog Converter', 'ตัวแปลงดิจิทัลเป็นอนาล็อก', 'hardware', 'medium'),
('ADC', 'Analog to Digital Converter', 'ตัวแปลงอนาล็อกเป็นดิจิทัล', 'hardware', 'medium'),
('DIMM', 'Dual Inline Memory Module', 'โมดูลหน่วยความจำแบบดูอัลอินไลน์', 'hardware', 'hard'),
('NVMe', 'Non-Volatile Memory Express', 'หน่วยความจำถาวรแบบด่วน', 'hardware', 'hard'),
('PCIe', 'Peripheral Component Interconnect Express', 'การเชื่อมต่อส่วนประกอบต่อพ่วงแบบด่วน', 'hardware', 'hard'),
('AGP', 'Accelerated Graphics Port', 'พอร์ตกราฟิกแบบเร่งความเร็ว', 'hardware', 'hard'),
('UEFI', 'Unified Extensible Firmware Interface', 'อินเตอร์เฟสเฟิร์มแวร์ขยายแบบรวม', 'hardware', 'hard'),
('TPU', 'Tensor Processing Unit', 'หน่วยประมวลผลเทนเซอร์', 'hardware', 'hard'),
('APU', 'Accelerated Processing Unit', 'หน่วยประมวลผลแบบเร่งความเร็ว', 'hardware', 'hard'),
('NPU', 'Neural Processing Unit', 'หน่วยประมวลผลเครือข่ายประสาท', 'hardware', 'hard'),
('EEPROM', 'Electrically Erasable Programmable Read Only Memory', 'หน่วยความจำอ่านอย่างเดียวลบได้ด้วยไฟฟ้า', 'hardware', 'hard'),
('MMU', 'Memory Management Unit', 'หน่วยจัดการหน่วยความจำ', 'hardware', 'hard'),
('SCSI', 'Small Computer System Interface', 'อินเตอร์เฟสระบบคอมพิวเตอร์ขนาดเล็ก', 'hardware', 'hard'),
('PATA', 'Parallel Advanced Technology Attachment', 'การเชื่อมต่อเทคโนโลยีขั้นสูงแบบขนาน', 'hardware', 'hard'),
('GPIO', 'General Purpose Input Output', 'อินพุตเอาต์พุตเอนกประสงค์', 'hardware', 'hard'),
('FPU', 'Floating Point Unit', 'หน่วยทศนิยมลอยตัว', 'hardware', 'hard'),
('ASIC', 'Application Specific Integrated Circuit', 'วงจรรวมเฉพาะทาง', 'hardware', 'hard'),
('FPGA', 'Field Programmable Gate Array', 'อาเรย์เกตโปรแกรมได้ภาคสนาม', 'hardware', 'hard'),
('SoC', 'System on a Chip', 'ระบบบนชิป', 'hardware', 'hard'),
('SODIMM', 'Small Outline Dual Inline Memory Module', 'โมดูลหน่วยความจำขนาดเล็ก', 'hardware', 'hard'),
('SPI', 'Serial Peripheral Interface', 'อินเตอร์เฟสอนุกรมอุปกรณ์ต่อพ่วง', 'hardware', 'hard'),
('I2C', 'Inter-Integrated Circuit', 'วงจรรวมระหว่างกัน', 'hardware', 'hard'),
('UART', 'Universal Asynchronous Receiver Transmitter', 'ตัวรับส่งอะซิงโครนัสสากล', 'hardware', 'hard'),
('PWM', 'Pulse Width Modulation', 'การมอดูเลตความกว้างพัลส์', 'hardware', 'hard'),
('RTC', 'Real Time Clock', 'นาฬิกาเวลาจริง', 'hardware', 'hard'),
('DP', 'DisplayPort', 'พอร์ตแสดงผล', 'hardware', 'medium');

-- =============================================
-- SEED DATA: Software (55 terms)
-- =============================================
INSERT INTO vocabulary (abbreviation, full_form, description_th, category, difficulty) VALUES
('OS', 'Operating System', 'ระบบปฏิบัติการ', 'software', 'easy'),
('API', 'Application Programming Interface', 'อินเตอร์เฟสการเขียนโปรแกรมประยุกต์', 'software', 'easy'),
('GUI', 'Graphical User Interface', 'อินเตอร์เฟสผู้ใช้แบบกราฟิก', 'software', 'easy'),
('CLI', 'Command Line Interface', 'อินเตอร์เฟสบรรทัดคำสั่ง', 'software', 'easy'),
('HTML', 'HyperText Markup Language', 'ภาษามาร์กอัปไฮเปอร์เท็กซ์', 'software', 'easy'),
('CSS', 'Cascading Style Sheets', 'แผ่นสไตล์แบบลำดับชั้น', 'software', 'easy'),
('SQL', 'Structured Query Language', 'ภาษาสอบถามเชิงโครงสร้าง', 'software', 'easy'),
('XML', 'Extensible Markup Language', 'ภาษามาร์กอัปขยายได้', 'software', 'easy'),
('JSON', 'JavaScript Object Notation', 'สัญกรณ์วัตถุจาวาสคริปต์', 'software', 'easy'),
('VM', 'Virtual Machine', 'เครื่องเสมือน', 'software', 'easy'),
('PHP', 'Hypertext Preprocessor', 'ตัวประมวลผลไฮเปอร์เท็กซ์', 'software', 'easy'),
('IDE', 'Integrated Development Environment', 'สภาพแวดล้อมการพัฒนาแบบบูรณาการ', 'software', 'medium'),
('SDK', 'Software Development Kit', 'ชุดพัฒนาซอฟต์แวร์', 'software', 'medium'),
('CMS', 'Content Management System', 'ระบบจัดการเนื้อหา', 'software', 'medium'),
('ERP', 'Enterprise Resource Planning', 'การวางแผนทรัพยากรองค์กร', 'software', 'medium'),
('CRM', 'Customer Relationship Management', 'การจัดการลูกค้าสัมพันธ์', 'software', 'medium'),
('DBMS', 'Database Management System', 'ระบบจัดการฐานข้อมูล', 'software', 'medium'),
('CRUD', 'Create Read Update Delete', 'สร้าง อ่าน แก้ไข ลบ', 'software', 'medium'),
('MVC', 'Model View Controller', 'โมเดล-วิว-คอนโทรลเลอร์', 'software', 'medium'),
('REST', 'Representational State Transfer', 'การถ่ายโอนสถานะแบบตัวแทน', 'software', 'medium'),
('DOM', 'Document Object Model', 'โมเดลวัตถุเอกสาร', 'software', 'medium'),
('DLL', 'Dynamic Link Library', 'ไลบรารีเชื่อมโยงแบบไดนามิก', 'software', 'medium'),
('CSV', 'Comma Separated Values', 'ค่าที่คั่นด้วยเครื่องหมายจุลภาค', 'software', 'medium'),
('NPM', 'Node Package Manager', 'ตัวจัดการแพ็กเกจโหนด', 'software', 'medium'),
('CDN', 'Content Delivery Network', 'เครือข่ายส่งเนื้อหา', 'software', 'medium'),
('SPA', 'Single Page Application', 'แอปพลิเคชันหน้าเดียว', 'software', 'medium'),
('ORM', 'Object Relational Mapping', 'การแมปวัตถุเชิงสัมพันธ์', 'software', 'medium'),
('CI', 'Continuous Integration', 'การรวมอย่างต่อเนื่อง', 'software', 'medium'),
('CD', 'Continuous Deployment', 'การปรับใช้อย่างต่อเนื่อง', 'software', 'medium'),
('RDBMS', 'Relational Database Management System', 'ระบบจัดการฐานข้อมูลเชิงสัมพันธ์', 'software', 'hard'),
('MVVM', 'Model View ViewModel', 'โมเดล-วิว-วิวโมเดล', 'software', 'hard'),
('SOAP', 'Simple Object Access Protocol', 'โปรโตคอลเข้าถึงวัตถุอย่างง่าย', 'software', 'hard'),
('AJAX', 'Asynchronous JavaScript and XML', 'จาวาสคริปต์และ XML แบบอะซิงโครนัส', 'software', 'hard'),
('JVM', 'Java Virtual Machine', 'เครื่องเสมือนจาวา', 'software', 'hard'),
('JDK', 'Java Development Kit', 'ชุดพัฒนาจาวา', 'software', 'hard'),
('JRE', 'Java Runtime Environment', 'สภาพแวดล้อมรันไทม์จาวา', 'software', 'hard'),
('TDD', 'Test Driven Development', 'การพัฒนาแบบขับเคลื่อนด้วยการทดสอบ', 'software', 'hard'),
('BDD', 'Behavior Driven Development', 'การพัฒนาแบบขับเคลื่อนด้วยพฤติกรรม', 'software', 'hard'),
('VCS', 'Version Control System', 'ระบบควบคุมเวอร์ชัน', 'software', 'hard'),
('BSOD', 'Blue Screen of Death', 'หน้าจอสีน้ำเงินแห่งความตาย', 'software', 'hard'),
('YAML', 'YAML Aint Markup Language', 'ภาษา YAML', 'software', 'hard'),
('REGEX', 'Regular Expression', 'นิพจน์ปกติ', 'software', 'hard'),
('UML', 'Unified Modeling Language', 'ภาษาแบบจำลองรวม', 'software', 'hard'),
('WYSIWYG', 'What You See Is What You Get', 'สิ่งที่เห็นคือสิ่งที่ได้', 'software', 'hard'),
('COBOL', 'Common Business Oriented Language', 'ภาษาเชิงธุรกิจทั่วไป', 'software', 'hard'),
('BASIC', 'Beginners All-purpose Symbolic Instruction Code', 'ภาษาเบสิก', 'software', 'hard'),
('GNU', 'GNUs Not Unix', 'กนู', 'software', 'hard'),
('POSIX', 'Portable Operating System Interface', 'อินเตอร์เฟสระบบปฏิบัติการแบบพกพา', 'software', 'hard'),
('SASS', 'Syntactically Awesome Style Sheets', 'แผ่นสไตล์ที่ยอดเยี่ยมทางไวยากรณ์', 'software', 'hard'),
('PWA', 'Progressive Web Application', 'เว็บแอปพลิเคชันแบบก้าวหน้า', 'software', 'hard'),
('SSR', 'Server Side Rendering', 'การเรนเดอร์ฝั่งเซิร์ฟเวอร์', 'software', 'hard'),
('CSR', 'Client Side Rendering', 'การเรนเดอร์ฝั่งไคลเอนต์', 'software', 'hard'),
('SCM', 'Source Code Management', 'การจัดการซอร์สโค้ด', 'software', 'hard'),
('EXE', 'Executable File', 'ไฟล์ที่สามารถเรียกใช้งานได้', 'software', 'easy'),
('LISP', 'List Processing', 'การประมวลผลรายการ', 'software', 'hard');

-- =============================================
-- SEED DATA: Networking (55 terms)
-- =============================================
INSERT INTO vocabulary (abbreviation, full_form, description_th, category, difficulty) VALUES
('IP', 'Internet Protocol', 'โปรโตคอลอินเทอร์เน็ต', 'networking', 'easy'),
('DNS', 'Domain Name System', 'ระบบชื่อโดเมน', 'networking', 'easy'),
('HTTP', 'HyperText Transfer Protocol', 'โปรโตคอลถ่ายโอนไฮเปอร์เท็กซ์', 'networking', 'easy'),
('HTTPS', 'HyperText Transfer Protocol Secure', 'โปรโตคอลถ่ายโอนไฮเปอร์เท็กซ์แบบปลอดภัย', 'networking', 'easy'),
('FTP', 'File Transfer Protocol', 'โปรโตคอลถ่ายโอนไฟล์', 'networking', 'easy'),
('LAN', 'Local Area Network', 'เครือข่ายท้องถิ่น', 'networking', 'easy'),
('WAN', 'Wide Area Network', 'เครือข่ายบริเวณกว้าง', 'networking', 'easy'),
('VPN', 'Virtual Private Network', 'เครือข่ายส่วนตัวเสมือน', 'networking', 'easy'),
('ISP', 'Internet Service Provider', 'ผู้ให้บริการอินเทอร์เน็ต', 'networking', 'easy'),
('P2P', 'Peer to Peer', 'เพียร์ทูเพียร์', 'networking', 'easy'),
('IoT', 'Internet of Things', 'อินเทอร์เน็ตของสรรพสิ่ง', 'networking', 'easy'),
('TCP', 'Transmission Control Protocol', 'โปรโตคอลควบคุมการส่ง', 'networking', 'medium'),
('UDP', 'User Datagram Protocol', 'โปรโตคอลดาตาแกรมผู้ใช้', 'networking', 'medium'),
('DHCP', 'Dynamic Host Configuration Protocol', 'โปรโตคอลกำหนดค่าโฮสต์แบบไดนามิก', 'networking', 'medium'),
('SSL', 'Secure Sockets Layer', 'ชั้นซ็อกเก็ตที่ปลอดภัย', 'networking', 'medium'),
('SSH', 'Secure Shell', 'เชลล์ที่ปลอดภัย', 'networking', 'medium'),
('SMTP', 'Simple Mail Transfer Protocol', 'โปรโตคอลถ่ายโอนจดหมายแบบง่าย', 'networking', 'medium'),
('MAN', 'Metropolitan Area Network', 'เครือข่ายบริเวณนครหลวง', 'networking', 'medium'),
('PAN', 'Personal Area Network', 'เครือข่ายส่วนบุคคล', 'networking', 'medium'),
('NAT', 'Network Address Translation', 'การแปลที่อยู่เครือข่าย', 'networking', 'medium'),
('MAC', 'Media Access Control', 'การควบคุมการเข้าถึงสื่อ', 'networking', 'medium'),
('ARP', 'Address Resolution Protocol', 'โปรโตคอลแปลงที่อยู่', 'networking', 'medium'),
('ICMP', 'Internet Control Message Protocol', 'โปรโตคอลข้อความควบคุมอินเทอร์เน็ต', 'networking', 'medium'),
('IMAP', 'Internet Message Access Protocol', 'โปรโตคอลเข้าถึงข้อความอินเทอร์เน็ต', 'networking', 'medium'),
('TLS', 'Transport Layer Security', 'ความปลอดภัยชั้นขนส่ง', 'networking', 'medium'),
('VoIP', 'Voice over Internet Protocol', 'เสียงผ่านโปรโตคอลอินเทอร์เน็ต', 'networking', 'medium'),
('WLAN', 'Wireless Local Area Network', 'เครือข่ายท้องถิ่นไร้สาย', 'networking', 'medium'),
('SSID', 'Service Set Identifier', 'ตัวระบุชุดบริการ', 'networking', 'medium'),
('QoS', 'Quality of Service', 'คุณภาพการบริการ', 'networking', 'medium'),
('VLAN', 'Virtual Local Area Network', 'เครือข่ายท้องถิ่นเสมือน', 'networking', 'hard'),
('POP3', 'Post Office Protocol version 3', 'โปรโตคอลที่ทำการไปรษณีย์เวอร์ชัน 3', 'networking', 'hard'),
('SNMP', 'Simple Network Management Protocol', 'โปรโตคอลจัดการเครือข่ายอย่างง่าย', 'networking', 'hard'),
('NTP', 'Network Time Protocol', 'โปรโตคอลเวลาเครือข่าย', 'networking', 'hard'),
('LDAP', 'Lightweight Directory Access Protocol', 'โปรโตคอลเข้าถึงไดเรกทอรีน้ำหนักเบา', 'networking', 'hard'),
('BGP', 'Border Gateway Protocol', 'โปรโตคอลเกตเวย์ชายแดน', 'networking', 'hard'),
('OSPF', 'Open Shortest Path First', 'เส้นทางสั้นสุดเปิดก่อน', 'networking', 'hard'),
('RIP', 'Routing Information Protocol', 'โปรโตคอลข้อมูลการจัดเส้นทาง', 'networking', 'hard'),
('WEP', 'Wired Equivalent Privacy', 'ความเป็นส่วนตัวเทียบเท่าสาย', 'networking', 'hard'),
('WPA', 'Wi-Fi Protected Access', 'การเข้าถึง Wi-Fi ที่ป้องกัน', 'networking', 'hard'),
('SFTP', 'Secure File Transfer Protocol', 'โปรโตคอลถ่ายโอนไฟล์ที่ปลอดภัย', 'networking', 'hard'),
('SIP', 'Session Initiation Protocol', 'โปรโตคอลเริ่มต้นเซสชัน', 'networking', 'hard'),
('MPLS', 'Multi-Protocol Label Switching', 'การสลับป้ายกำกับหลายโปรโตคอล', 'networking', 'hard'),
('SDN', 'Software Defined Networking', 'เครือข่ายที่กำหนดด้วยซอฟต์แวร์', 'networking', 'hard'),
('NFV', 'Network Function Virtualization', 'การจำลองเสมือนฟังก์ชันเครือข่าย', 'networking', 'hard'),
('CIDR', 'Classless Inter-Domain Routing', 'การจัดเส้นทางระหว่างโดเมนแบบไร้คลาส', 'networking', 'hard'),
('TTL', 'Time to Live', 'เวลาที่มีชีวิต', 'networking', 'hard'),
('MTU', 'Maximum Transmission Unit', 'หน่วยส่งข้อมูลสูงสุด', 'networking', 'hard'),
('IDS', 'Intrusion Detection System', 'ระบบตรวจจับการบุกรุก', 'networking', 'hard'),
('IPS', 'Intrusion Prevention System', 'ระบบป้องกันการบุกรุก', 'networking', 'hard'),
('WAF', 'Web Application Firewall', 'ไฟร์วอลล์แอปพลิเคชันเว็บ', 'networking', 'hard'),
('DMZ', 'Demilitarized Zone', 'เขตปลอดทหาร', 'networking', 'hard'),
('RADIUS', 'Remote Authentication Dial-In User Service', 'บริการยืนยันตัวตนผู้ใช้ระยะไกล', 'networking', 'hard'),
('PoE', 'Power over Ethernet', 'ไฟฟ้าผ่านอีเทอร์เน็ต', 'networking', 'hard');

-- =============================================
-- SEED DATA: Programming & Data (50 terms)
-- =============================================
INSERT INTO vocabulary (abbreviation, full_form, description_th, category, difficulty) VALUES
('OOP', 'Object Oriented Programming', 'การเขียนโปรแกรมเชิงวัตถุ', 'programming', 'easy'),
('AI', 'Artificial Intelligence', 'ปัญญาประดิษฐ์', 'programming', 'easy'),
('URL', 'Uniform Resource Locator', 'ตัวระบุตำแหน่งทรัพยากร', 'programming', 'easy'),
('PDF', 'Portable Document Format', 'รูปแบบเอกสารพกพา', 'programming', 'easy'),
('GIF', 'Graphics Interchange Format', 'รูปแบบแลกเปลี่ยนกราฟิก', 'programming', 'easy'),
('PNG', 'Portable Network Graphics', 'กราฟิกเครือข่ายแบบพกพา', 'programming', 'easy'),
('JPEG', 'Joint Photographic Experts Group', 'กลุ่มผู้เชี่ยวชาญภาพถ่ายร่วม', 'programming', 'easy'),
('QR', 'Quick Response', 'การตอบสนองรวดเร็ว', 'programming', 'easy'),
('AR', 'Augmented Reality', 'ความเป็นจริงเสริม', 'programming', 'easy'),
('VR', 'Virtual Reality', 'ความเป็นจริงเสมือน', 'programming', 'easy'),
('ML', 'Machine Learning', 'การเรียนรู้ของเครื่อง', 'programming', 'medium'),
('DL', 'Deep Learning', 'การเรียนรู้เชิงลึก', 'programming', 'medium'),
('NLP', 'Natural Language Processing', 'การประมวลผลภาษาธรรมชาติ', 'programming', 'medium'),
('CV', 'Computer Vision', 'คอมพิวเตอร์วิทัศน์', 'programming', 'medium'),
('SaaS', 'Software as a Service', 'ซอฟต์แวร์ในรูปแบบบริการ', 'programming', 'medium'),
('PaaS', 'Platform as a Service', 'แพลตฟอร์มในรูปแบบบริการ', 'programming', 'medium'),
('IaaS', 'Infrastructure as a Service', 'โครงสร้างพื้นฐานในรูปแบบบริการ', 'programming', 'medium'),
('FIFO', 'First In First Out', 'เข้าก่อนออกก่อน', 'programming', 'medium'),
('LIFO', 'Last In First Out', 'เข้าหลังออกก่อน', 'programming', 'medium'),
('ASCII', 'American Standard Code for Information Interchange', 'รหัสมาตรฐานอเมริกันสำหรับแลกเปลี่ยนข้อมูล', 'programming', 'medium'),
('URI', 'Uniform Resource Identifier', 'ตัวระบุทรัพยากร', 'programming', 'medium'),
('SVG', 'Scalable Vector Graphics', 'กราฟิกเวกเตอร์ปรับขนาดได้', 'programming', 'medium'),
('MP3', 'MPEG Audio Layer 3', 'ชั้นเสียง MPEG 3', 'programming', 'medium'),
('MPEG', 'Moving Picture Experts Group', 'กลุ่มผู้เชี่ยวชาญภาพเคลื่อนไหว', 'programming', 'medium'),
('OCR', 'Optical Character Recognition', 'การรู้จำอักขระด้วยแสง', 'programming', 'medium'),
('CODEC', 'Coder Decoder', 'ตัวเข้ารหัส-ถอดรหัส', 'programming', 'medium'),
('AES', 'Advanced Encryption Standard', 'มาตรฐานการเข้ารหัสขั้นสูง', 'programming', 'hard'),
('RSA', 'Rivest Shamir Adleman', 'อัลกอริทึมการเข้ารหัส RSA', 'programming', 'hard'),
('SHA', 'Secure Hash Algorithm', 'อัลกอริทึมแฮชที่ปลอดภัย', 'programming', 'hard'),
('MD5', 'Message Digest Algorithm 5', 'อัลกอริทึมย่อยข้อความ 5', 'programming', 'hard'),
('PKI', 'Public Key Infrastructure', 'โครงสร้างพื้นฐานกุญแจสาธารณะ', 'programming', 'hard'),
('OAuth', 'Open Authorization', 'การอนุญาตแบบเปิด', 'programming', 'hard'),
('JWT', 'JSON Web Token', 'โทเค็นเว็บ JSON', 'programming', 'hard'),
('XSS', 'Cross Site Scripting', 'การเขียนสคริปต์ข้ามไซต์', 'programming', 'hard'),
('CSRF', 'Cross Site Request Forgery', 'การปลอมแปลงคำขอข้ามไซต์', 'programming', 'hard'),
('DDoS', 'Distributed Denial of Service', 'การโจมตีปฏิเสธบริการแบบกระจาย', 'programming', 'hard'),
('CAPTCHA', 'Completely Automated Public Turing test to tell Computers and Humans Apart', 'การทดสอบทัวริงสาธารณะอัตโนมัติ', 'programming', 'hard'),
('ETL', 'Extract Transform Load', 'สกัด แปลง โหลด', 'programming', 'hard'),
('NoSQL', 'Not Only SQL', 'ไม่ใช่แค่ SQL', 'programming', 'hard'),
('BLOB', 'Binary Large Object', 'วัตถุไบนารีขนาดใหญ่', 'programming', 'hard'),
('ECC', 'Error Correcting Code', 'รหัสแก้ไขข้อผิดพลาด', 'programming', 'hard'),
('CRC', 'Cyclic Redundancy Check', 'การตรวจสอบความซ้ำซ้อนแบบวงรอบ', 'programming', 'hard'),
('GUID', 'Globally Unique Identifier', 'ตัวระบุที่ไม่ซ้ำกันทั่วโลก', 'programming', 'hard'),
('UUID', 'Universally Unique Identifier', 'ตัวระบุที่ไม่ซ้ำกันสากล', 'programming', 'hard'),
('TIFF', 'Tagged Image File Format', 'รูปแบบไฟล์ภาพแบบแท็ก', 'programming', 'hard'),
('BMP', 'Bitmap Image File', 'ไฟล์ภาพบิตแมป', 'programming', 'medium'),
('FLAC', 'Free Lossless Audio Codec', 'ตัวแปลงสัญญาณเสียงไม่สูญเสียฟรี', 'programming', 'hard'),
('MP4', 'MPEG-4 Part 14', 'รูปแบบวิดีโอ MPEG-4', 'programming', 'medium');
