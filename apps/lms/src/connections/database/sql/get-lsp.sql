CREATE OR REPLACE FUNCTION GET_LSP(LSP_ID UUID) RETURNS VARCHAR(8) AS $$
    DECLARE COUNT_INTERNAL INTEGER;
    
    BEGIN
        
        SELECT COUNT(TRAINING_LSP_INDIVIDUAL.lsp_individual_details_id_fk) INTO COUNT_INTERNAL FROM TRAINING_LSP_INDIVIDUAL WHERE LSP_INDIVIDUAL_DETAILS_ID_FK = LSP_ID;
    
        IF COUNT_INTERNAL > 0  THEN
            RETURN 'InternalS';
        ELSE
            RETURN 'ExternalS';
        END IF;
    END;
    $$ LANGUAGE PLPGSQL;