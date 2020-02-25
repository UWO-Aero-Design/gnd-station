@echo off

IF EXIST Aerodb.db (
    echo "test1.db file detected in current directory, deleting..."
    del "Aerodb.db" /f /q
    echo "creating database..."
    echo .quit | sqlite3.exe -init database_schema.sql Aerodb.db
    echo "database created!"
    PAUSE

) ELSE (
    echo "No previous database detected"
    echo "creating database..."
    echo .quit | sqlite3.exe -init database_schema.sql Aerodb.db
    echo "database created!"
    PAUSE
)