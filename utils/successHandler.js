const successHandler = (res, template, data) =>
  res.render(template, {
    user_id: data._id,
    name: data.name,
    email: data.email,
    username: data.username,
    meal: data.meal
  });

module.exports = successHandler;
