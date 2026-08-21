const zodValidator = (schema, obj, res) => {
  const validate = schema.safeParse(obj);

  if (!validate.success) {
    console.error('Validation Error:', JSON.stringify(validate.error.issues, null, 2));
    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: validate.error.issues[0].message,
      field: validate.error.issues[0].path[0],
      allErrors: validate.error.issues.map(issue => ({
        field: issue.path[0],
        message: issue.message
      }))
    });
    return null;
  }
  
  return validate.data;
};

export default zodValidator;