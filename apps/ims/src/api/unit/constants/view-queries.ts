export const UNITS_VIEW_QUERY = `SELECT unit_types.type, units_of_measure.name, units_of_measure.symbol
FROM units_of_measure
INNER JOIN unit_types ON unit_types.unit_type_id = units_of_measure.unit_type_id_fk`;
