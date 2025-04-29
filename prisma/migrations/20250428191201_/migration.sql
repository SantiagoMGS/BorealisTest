-- AlterTable
CREATE SEQUENCE dore_code_seq START WITH 30000;
ALTER TABLE "dore" ALTER COLUMN "code" SET DEFAULT nextval('dore_code_seq');
ALTER SEQUENCE dore_code_seq OWNED BY "dore"."code";
