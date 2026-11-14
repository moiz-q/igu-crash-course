PRAGMA foreign_keys = ON;

CREATE TABLE Departments (
    dept_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    dept_name   TEXT NOT NULL UNIQUE,
    building    TEXT NOT NULL
);

CREATE TABLE Instructors (
    instructor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    email         TEXT UNIQUE,
    dept_id       INTEGER NOT NULL,
    hire_date     TEXT NOT NULL,
    salary        REAL NOT NULL CHECK (salary > 0),
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);

CREATE TABLE Students (
    student_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    city            TEXT NOT NULL,
    birth_date      TEXT NOT NULL,
    email           TEXT UNIQUE,
    dept_id         INTEGER NOT NULL,
    enrollment_year INTEGER NOT NULL,
    gpa             REAL CHECK (gpa IS NULL OR (gpa >= 0.0 AND gpa <= 4.0)),
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);

CREATE TABLE Courses (
    course_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code   TEXT NOT NULL UNIQUE,
    title         TEXT NOT NULL,
    credits       INTEGER NOT NULL CHECK (credits > 0),
    dept_id       INTEGER NOT NULL,
    instructor_id INTEGER NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id),
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
);

CREATE TABLE Enrollments (
    enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id    INTEGER NOT NULL,
    course_id     INTEGER NOT NULL,
    semester      TEXT NOT NULL DEFAULT '2026-Fall',
    grade         REAL CHECK (grade IS NULL OR (grade >= 0 AND grade <= 100)),
    UNIQUE (student_id, course_id, semester),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

INSERT INTO Departments (dept_name, building) VALUES
('Computer Programming', 'Block A'),
('Software Engineering', 'Block B'),
('Information Security', 'Block B'),
('Graphic Design', 'Block C'),
('Business Administration', 'Block D');

INSERT INTO Instructors (first_name, last_name, email, dept_id, hire_date, salary) VALUES
('Mehmet', 'Yilmaz', 'm.yilmaz@igu.edu.tr', 1, '2018-09-01', 62000),
('Ayse', 'Demir', 'a.demir@igu.edu.tr', 1, '2020-02-15', 58000),
('Kemal', 'Kaya', 'k.kaya@igu.edu.tr', 2, '2016-09-01', 71000),
('Zeynep', 'Celik', 'z.celik@igu.edu.tr', 3, '2021-09-01', 55000),
('Can', 'Arslan', 'c.arslan@igu.edu.tr', 1, '2023-02-01', 51000),
('Elif', 'Sahin', NULL, 4, '2019-09-01', 56000),
('Murat', 'Ozturk', 'm.ozturk@igu.edu.tr', 5, '2017-03-10', 64000),
('Selin', 'Aydin', 's.aydin@igu.edu.tr', 2, '2022-09-01', 53000);

INSERT INTO Students (first_name, last_name, city, birth_date, email, dept_id, enrollment_year, gpa) VALUES
('Deniz', 'Aksoy', 'Istanbul', '2006-04-12', 'deniz.aksoy@stu.igu.edu.tr', 1, 2026, 3.45),
('Ece', 'Yildiz', 'Istanbul', '2005-11-03', 'ece.yildiz@stu.igu.edu.tr', 1, 2026, 3.80),
('Kerem', 'Koc', 'Ankara', '2006-01-22', 'kerem.koc@stu.igu.edu.tr', 1, 2026, 2.90),
('Merve', 'Polat', 'Izmir', '2005-07-19', 'merve.polat@stu.igu.edu.tr', 1, 2025, 3.15),
('Emre', 'Gunes', 'Bursa', '2006-09-08', NULL, 1, 2026, 2.50),
('Nisa', 'Kurt', 'Istanbul', '2006-03-30', 'nisa.kurt@stu.igu.edu.tr', 2, 2026, 3.92),
('Bora', 'Tas', 'Ankara', '2005-12-14', 'bora.tas@stu.igu.edu.tr', 2, 2025, 2.75),
('Sude', 'Aslan', 'Antalya', '2006-06-25', 'sude.aslan@stu.igu.edu.tr', 1, 2026, NULL),
('Yusuf', 'Karahan', 'Istanbul', '2005-05-05', 'yusuf.karahan@stu.igu.edu.tr', 3, 2025, 3.10),
('Defne', 'Ozkan', 'Izmir', '2006-08-17', 'defne.ozkan@stu.igu.edu.tr', 3, 2026, 3.60),
('Arda', 'Bulut', 'Istanbul', '2006-02-11', NULL, 1, 2026, 2.20),
('Irem', 'Dogan', 'Trabzon', '2005-10-29', 'irem.dogan@stu.igu.edu.tr', 4, 2025, 3.30),
('Kaan', 'Erdogan', 'Istanbul', '2006-07-04', 'kaan.erdogan@stu.igu.edu.tr', 1, 2026, 3.05),
('Lina', 'Mansour', 'Istanbul', '2005-09-18', 'lina.mansour@stu.igu.edu.tr', 1, 2026, 3.70),
('Omar', 'Farouk', 'Ankara', '2006-11-27', 'omar.farouk@stu.igu.edu.tr', 2, 2026, 3.25),
('Tarik', 'Sari', 'Bursa', '2005-03-09', 'tarik.sari@stu.igu.edu.tr', 5, 2025, 2.65),
('Melis', 'Cetin', 'Istanbul', '2006-12-01', 'melis.cetin@stu.igu.edu.tr', 1, 2026, 3.55),
('Cem', 'Yavuz', 'Izmir', '2005-08-23', NULL, 3, 2025, NULL),
('Hanna', 'Alver', 'Istanbul', '2006-05-14', 'hanna.alver@stu.igu.edu.tr', 1, 2026, 3.88),
('Baran', 'Eren', 'Adana', '2006-01-06', 'baran.eren@stu.igu.edu.tr', 4, 2026, 2.80),
('Zehra', 'Kilic', 'Istanbul', '2005-04-21', 'zehra.kilic@stu.igu.edu.tr', 1, 2025, 3.40),
('Ozan', 'Tekin', 'Ankara', '2006-10-15', 'ozan.tekin@stu.igu.edu.tr', 2, 2026, 2.95),
('Asli', 'Duman', 'Istanbul', '2006-06-02', 'asli.duman@stu.igu.edu.tr', 1, 2026, 3.12),
('Rami', 'Nasser', 'Istanbul', '2005-02-28', 'rami.nasser@stu.igu.edu.tr', 1, 2026, NULL);

INSERT INTO Courses (course_code, title, credits, dept_id, instructor_id) VALUES
('CMP153', 'Programming Basics I', 6, 1, 1),
('CMP151', 'Database Management Systems I', 5, 1, 2),
('CMP155', 'Computer Networks', 5, 1, 5),
('MTH153', 'Mathematics I', 4, 1, 2),
('CMP156', 'Integrated Office Applications', 3, 1, 5),
('SE201', 'Software Design', 6, 2, 3),
('SEC101', 'Network Security Basics', 5, 3, 4),
('GD105', 'Digital Typography', 4, 4, 6),
('BUS101', 'Intro to Business', 3, 5, 7),
('CMP299', 'Special Topics in C', 3, 1, 1);

INSERT INTO Enrollments (student_id, course_id, semester, grade) VALUES
(1, 1, '2026-Fall', 85),
(1, 2, '2026-Fall', 90),
(1, 3, '2026-Fall', 78),
(2, 1, '2026-Fall', 95),
(2, 2, '2026-Fall', 92),
(2, 4, '2026-Fall', 88),
(3, 1, '2026-Fall', 70),
(3, 2, '2026-Fall', 65),
(4, 1, '2026-Fall', 82),
(4, 2, '2026-Fall', 79),
(4, 3, '2026-Fall', 84),
(5, 1, '2026-Fall', 58),
(5, 2, '2026-Fall', NULL),
(6, 6, '2026-Fall', 96),
(6, 2, '2026-Fall', 94),
(7, 6, '2026-Fall', 68),
(8, 1, '2026-Fall', NULL),
(9, 7, '2026-Fall', 76),
(9, 3, '2026-Fall', 80),
(10, 7, '2026-Fall', 89),
(11, 1, '2026-Fall', 45),
(11, 2, '2026-Fall', 52),
(12, 8, '2026-Fall', 83),
(13, 1, '2026-Fall', 74),
(13, 2, '2026-Fall', 81),
(14, 1, '2026-Fall', 91),
(14, 2, '2026-Fall', 87),
(15, 6, '2026-Fall', 84),
(16, 9, '2026-Fall', 72),
(17, 1, '2026-Fall', 88),
(17, 2, '2026-Fall', 86),
(19, 1, '2026-Fall', 93),
(19, 2, '2026-Fall', 91),
(20, 8, '2026-Fall', 75),
(21, 1, '2026-Fall', 85),
(21, 5, '2026-Fall', 90),
(22, 6, '2026-Fall', 71);
-- Note: students 18, 23, 24 have no enrollments; course 10 (CMP299) has no enrollments.
