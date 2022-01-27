const WEATHER = document.querySelector("#weather");

const NOTIFICATION = WEATHER.querySelector(".form__notification");
const FORECAST = WEATHER.querySelector(".presents .description > .forecast");

const TABS = {
  COLLECTION: WEATHER.querySelectorAll(".presents .description > *"),
  NOW: WEATHER.querySelector(".presents .description > .now"),
  DETAILS: WEATHER.querySelector(".presents .description > .details"),
  FORECAST: {
    CITY: FORECAST.querySelector(".city"),
    LIST: FORECAST.querySelector(".details"),
    SIZE: 20,
  },
};

const TEMPLATES = {
  FAVORITES: WEATHER.querySelector(".favourite .locations .city"),
  FORECAST: FORECAST.querySelector(
    ".presents .description > .forecast .details li"
  ),
};

const FORM = document.forms.weather;
const LIKE = WEATHER.querySelector(".like");
const BUTTONS = WEATHER.querySelectorAll(".presents .selects button");
const FAVORITES = WEATHER.querySelector(".favourite .locations");

export const NODES = {
  FORM,
  LIKE,
  BUTTONS,
  FAVORITES,
};

export const controls = {
  notify(msg) {
    NOTIFICATION.textContent = msg;
    activate(NOTIFICATION);

    setTimeout(() => deactivate(NOTIFICATION), 2000);
  },
  setLike(liked) {
    liked ? activate(LIKE) : deactivate(LIKE);
  },
  initForecast(size) {
    clearChildren(TABS.FORECAST.LIST);

    for (let i = 0; i < size; i++) {
      const node = TEMPLATES.FORECAST.cloneNode(true);
      TABS.FORECAST.LIST.prepend(node);
    }
  },
  updateTabs(data) {
    fillTab(TABS.NOW, data);
    fillTab(TABS.DETAILS, data);

    TABS.FORECAST.CITY.textContent = data.city;

    Array.from(TABS.FORECAST.LIST.children).forEach((node, index) => {
      if (data.forecast.length > index) fillTab(node, data.forecast[index]);
    });
  },
  addFavorite(city) {
    const node = TEMPLATES.FAVORITES.cloneNode(true);

    node.firstElementChild.textContent = city;

    FAVORITES.prepend(node);
    createEvent(FAVORITES, "add", { city, node });
  },
  removeFavorite(city) {
    Array.from(FAVORITES.children).filter((node) => {
      if (node.firstElementChild.textContent == city) node.remove();
      createEvent(FAVORITES, "remove", { city, node });
    });
  },
};

function createEvent(node, name, detail) {
  node.dispatchEvent(new CustomEvent(name, { detail }));
}

function fillTab(tab, data) {
  Object.entries(data).forEach(([key, value]) => {
    const node = tab.querySelector(`.${key}`);

    if (node) node[key == "icon" ? "src" : "textContent"] = value;
  });
}

function activate(node) {
  node.classList.add("active");
}

function deactivate(node) {
  node.classList.remove("active");
}

BUTTONS.forEach((button, index) => {
  button.addEventListener("click", () => {
    TABS.COLLECTION.forEach(deactivate);
    activate(TABS.COLLECTION[index]);

    BUTTONS.forEach(deactivate);
    activate(BUTTONS[index]);
  });
});

function clearChildren(node) {
  while (node.children.length) node.children[0].remove();
}

clearChildren(FAVORITES);

controls.initForecast(TABS.FORECAST.SIZE);
