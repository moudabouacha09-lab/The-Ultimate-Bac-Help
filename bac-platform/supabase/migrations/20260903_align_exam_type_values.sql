-- Keep the upload form's canonical values in sync with the live exams table.
-- Preserve any values already used by existing rows while allowing the four
-- values used by the current app: trimestre1, trimestre2, trimestre3, series.
DO $$
DECLARE
  existing_values text;
BEGIN
  ALTER TABLE public.exams DROP CONSTRAINT IF EXISTS exams_type_check;

  SELECT string_agg(quote_literal(type), ', ' ORDER BY type)
    INTO existing_values
  FROM (
    SELECT DISTINCT type
    FROM public.exams
    WHERE type IS NOT NULL
  ) AS existing_types;

  EXECUTE format(
    'ALTER TABLE public.exams ADD CONSTRAINT exams_type_check CHECK (type IN (%s))',
    concat_ws(
      ', ',
      existing_values,
      quote_literal('trimestre1'),
      quote_literal('trimestre2'),
      quote_literal('trimestre3'),
      quote_literal('series')
    )
  );
END $$;
