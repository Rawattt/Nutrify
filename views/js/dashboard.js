// Custom element for a meal

class CustomEl extends HTMLElement {
  renderSpan() {
    this.innerHTML = `
              <div class="card" style="width: 15rem;" id="${this.getAttribute(
                '_id'
              )}">
    <div class="card-body">
      <h5 class="card-title food_name">${this.getAttribute('food_name')}</h5>
      <h6 class="card-subtitle mb-2 text-muted description">${this.getAttribute(
        'description'
      )}</h6>
      <h6 class="card-subtitle mb-2 text-muted calories">${this.getAttribute(
        'calories'
      )}</h6>
      <p>
  <a class="btn btn-primary" data-toggle="collapse" href="#prefix${this.getAttribute(
    '_id'
  )}" role="button" aria-expanded="false" aria-controls="prefix${this.getAttribute(
      '_id'
    )}">
    Edit
  </a>
  <a class="btn btn-primary delete-btn" delete_id="${this.getAttribute('_id')}">
    Delete
  </a>
</p>
<div class="collapse" id="prefix${this.getAttribute('_id')}">

<form class='edit-meal-form' _id=${this.getAttribute('_id')}>
  <div class="form-group">
    <input type="text" required class="form-control" placeholder='Food Name' value="${this.getAttribute(
      'food_name'
    )}">
  </div>
  <div class="form-group">
    <input type="text" required class="form-control" placeholder='Description' value="${this.getAttribute(
      'description'
    )}">
  </div>
  <div class="form-group">
    <input type="number" required min='1' class="form-control" placeholder='Calories' value="${this.getAttribute(
      'calories'
    )}">
  </div>
  <button type="submit" class="btn btn-primary">Change Meal</button>
</form>
    </div>
  </div>
</div>
`;
  }
  connectedCallback() {
    if (!this.rendered) {
      this.renderSpan();
      this.rendered = true;
    }
  }
}
customElements.define('meal-el', CustomEl);

console.log(data);

// Base url
const url = 'http://localhost:3000';

// Generate JSON form data
const jsonForm = (form_data) => {
  let obj = {};
  for (const [name, value] of form_data) {
    obj[name] = value;
  }
  return JSON.stringify(obj);
};

// Error Handler
const errorHandler = (message) => {
  alert(message);
};

// All meals container
const divMeal = document.querySelector('.meal-container');

// Create element for a single meal
const outputMeal = (id, food, desc, calories) => {
  let tmp = `<meal-el _id="${id}" food_name="${food}" description="${desc}" calories=${calories}></meal-el>`;

  return tmp;
};
// Create all meals
const allMealContent = (data) => {
  let outputResult = '';
  data.forEach((meal) => {
    outputResult += outputMeal(
      meal._id,
      meal.food_name,
      meal.description,
      meal.calories
    );
  });
  return outputResult;
};

// Set meal container values to the generated meal tags
const updateUI = (meal) => {
  divMeal.innerHTML = allMealContent(meal);
};

updateUI(data.meal);

// Delete Handler
//
const deleteHandler = async (id) => {
  try {
    let el = document.getElementById(id);

    let curr_cal = parseInt(el.querySelector('.calories').textContent);

    // Create the url for post request
    let new_url = `${url}/meal/delete/${id}`;

    const res = await fetch(new_url, {
      method: 'POST'
    });

    el.remove();
    data.consumed = parseInt(data.consumed) - curr_cal;
    progressBarHandler(data.consumed, data.calories_per_day);
  } catch (error) {}
};

// Add click event listener for all delete button
Array.from(document.querySelectorAll('.delete-btn')).forEach((item) =>
  item.addEventListener('click', () =>
    deleteHandler(item.getAttribute('delete_id'))
  )
);

// EDIT MEAL
// Update meal data in UI
const updateMeal = (el, food_name, desc, cal) => {
  el.querySelector('.food_name').textContent = food_name;
  el.querySelector('.description').textContent = desc;
  let cal_diff =
    parseInt(cal) - parseInt(el.querySelector('.calories').textContent);

  el.querySelector('.calories').textContent = cal;

  // To update the progress bar after edit
  data.consumed = parseInt(data.consumed) + cal_diff;
  progressBarHandler(data.consumed, data.calories_per_day);
};

// Update meal handler
const editMealHandler = async (event) => {
  try {
    event.preventDefault();

    // Get form data for request
    let meal_id = event.target.getAttribute('_id');
    let new_food_name = event.target[0].value;
    let new_desc = event.target[1].value;
    let new_calories = event.target[2].value;

    let body = {
      food_name: new_food_name,
      description: new_desc,
      calories: new_calories
    };

    // Making request
    const res = await fetch(`${url}/meal/edit/${meal_id}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const res_data = await res.json();

    // Update UI on success
    if (res_data.success) {
      let meal_container = document.getElementById(
        event.target.getAttribute('_id')
      );
      updateMeal(
        meal_container,
        event.target[0].value,
        event.target[1].value,
        event.target[2].value
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};

const all_edit_form = document.querySelectorAll('.edit-meal-form');

Array.from(all_edit_form).forEach((form) => {
  // console.log(form);
  form.addEventListener('submit', (e) => editMealHandler(e));
});

// PROGRESS BAR

// Progress bar node
const progress_bar = document.querySelector('.progress-bar');

// Progress handler
const progressBarHandler = (consumed, total) => {
  if (data.today) {
    // Width for styling progress
    let progress_width = (100 * parseInt(consumed)) / parseInt(total);

    progress_bar.style.width = `${progress_width}%`;

    // Content to show consumed calories
    let progress_data = `${consumed} / ${total}`;

    progress_bar.textContent = progress_data;

    // Check if user has exceeded the daily limit
    if (consumed >= total) {
      progress_bar.style.backgroundColor = 'red';
      alert('You have consumed sufficient calories for today');
    } else {
      progress_bar.style.backgroundColor = '#007bff';
    }
  }
};

progressBarHandler(data.consumed, data.calories_per_day);
