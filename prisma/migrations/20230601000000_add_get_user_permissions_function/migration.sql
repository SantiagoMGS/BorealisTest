-- Crear función que devuelve los permisos de un usuario para una compañía específica
CREATE OR REPLACE FUNCTION public.get_user_permissions_by_company(
  p_user_id UUID,
  p_company_id UUID
) 
RETURNS TABLE (
  "roleId" UUID,
  "roleName" TEXT,
  "applicationId" UUID,
  "applicationName" TEXT,
  "applicationPath" TEXT,
  "applicationIsActive" BOOLEAN,
  "resourceId" UUID,
  "resourceName" TEXT,
  "resourceIcon" TEXT,
  "resourcePath" TEXT,
  "subresourceId" UUID,
  "subresourceName" TEXT,
  "subresourceIcon" TEXT,
  "subresourcePath" TEXT,
  "actionId" UUID,
  "actionName" TEXT,
  "actionLevel" INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Obtener el ID del rol del usuario en la compañía
  SELECT uc."roleId" INTO v_role_id
  FROM user_companies uc
  WHERE uc."userId" = p_user_id
  AND uc."companyId" = p_company_id
  AND uc."isActive" = true;

  -- Si no encontramos un rol, retornar un conjunto vacío
  IF v_role_id IS NULL THEN
    RETURN;
  END IF;

  -- Retornar todos los permisos para ese rol y compañía
  RETURN QUERY
  SELECT 
    r.id as "roleId", 
    r.name as "roleName",
    app.id as "applicationId", 
    app.name as "applicationName",
    app.path as "applicationPath",
    app."isActive" as "applicationIsActive",
    res.id as "resourceId",
    res.name as "resourceName",
    res.icon as "resourceIcon",
    res.path as "resourcePath",
    s.id as "subresourceId",
    s.name as "subresourceName",
    s.icon as "subresourceIcon",
    s.path as "subresourcePath",
    a.id as "actionId",
    a.name as "actionName",
    a.level as "actionLevel"
  FROM role_permissions rp
  JOIN roles r ON r.id = rp."roleId"
  JOIN actions a ON a.id = rp."actionId"
  JOIN subresources s ON s.id = rp."subresourceId"
  JOIN resources res ON res.id = s."resourceId"
  JOIN application_resources ar ON res.id = ar."resourceId"
  JOIN applications app ON app.id = ar."applicationId"
  JOIN company_applications ca ON ca."applicationId" = app.id
  WHERE rp."roleId" = v_role_id
  AND ca."companyId" = p_company_id
  AND ar."isActive" = true
  AND app."isActive" = true
  AND ca."isActive" = true
  ORDER BY app.name, res.name, s.name, a.name;
END;
$$; 