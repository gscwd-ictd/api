CREATE OR REPLACE FUNCTION GET_LSP_FULLNAME(id UUID) 
RETURNS TEXT AS 
$$
DECLARE FULLNAME TEXT;

BEGIN
    SELECT 
        CASE 
            WHEN prefix_name <> '' THEN prefix_name || ' ' 
            ELSE '' 
        END ||
        first_name || ' ' ||
        CASE 
            WHEN middle_name <> '' THEN SUBSTRING(middle_name FROM 1 FOR 1) || '. ' 
            ELSE '' 
        END ||
        last_name || 
        CASE 
            WHEN extension_name <> '' THEN ' ' || extension_name 
            ELSE '' 
        END ||
        CASE 
            WHEN suffix_name <> '' THEN ' ' || suffix_name 
            ELSE '' 
        END INTO FULLNAME
    FROM LSP_DETAILS WHERE LSP_DETAILS_ID = id;
	
	RETURN FULLNAME;
END;
$$ LANGUAGE PLPGSQL;