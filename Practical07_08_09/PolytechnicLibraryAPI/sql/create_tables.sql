IF DB_ID('polytechnic_library_db') IS NULL
BEGIN
    CREATE DATABASE polytechnic_library_db;
END
GO

USE polytechnic_library_db;
GO

IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
    DROP TABLE dbo.Users;
GO

IF OBJECT_ID('dbo.Books', 'U') IS NOT NULL
    DROP TABLE dbo.Books;
GO

CREATE TABLE dbo.Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'librarian'))
);
GO

CREATE TABLE dbo.Books (
    book_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    availability CHAR(1) NOT NULL DEFAULT 'Y' CHECK (availability IN ('Y', 'N'))
);
GO

INSERT INTO dbo.Books (title, author, availability) VALUES
    ('To Kill a Mockingbird', 'Harper Lee', 'Y'),
    ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'N'),
    ('Dune', 'Frank Herbert', 'Y'),
    ('The Great Gatsby', 'F. Scott Fitzgerald', 'Y'),
    ('Clean Code', 'Robert C. Martin', 'Y');
GO

IF EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'booksapi_user')
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'booksapi_user')
        CREATE USER booksapi_user FOR LOGIN booksapi_user;

    ALTER ROLE db_datareader ADD MEMBER booksapi_user;
    ALTER ROLE db_datawriter ADD MEMBER booksapi_user;
END
GO
