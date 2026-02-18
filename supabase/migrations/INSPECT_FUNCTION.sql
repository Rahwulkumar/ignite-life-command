SELECT 
    r.routine_name,
    p.parameter_name,
    p.data_type,
    p.ordinal_position,
    p.parameter_mode
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p 
    ON r.specific_name = p.specific_name
WHERE r.routine_name = 'create_bible_character'
ORDER BY p.ordinal_position;
