"use strict";
const body = document.querySelector("body");
const keywordEl = document.querySelector(".input--keyword");
const locEl = document.querySelector(".input--location");
const distEl = document.querySelector(".input--distance");
const categoryEl = document.querySelector(".input--category");
const checkEl = document.querySelector(".checkbox");
const submitEl = document.querySelector(".btn--submit");
const clearEl = document.querySelector(".btn--clear");
const errMsg = document.querySelector(".error-msg");

const ipinfo_token = "1f32afdd229fc2";
const gmap_key = "AIzaSyD_dCp0f6u9tTb0AR9qQvrAmNtjAs3WC_U";
// document
//   .querySelector(".input--keyword")
//   .addEventListener("click", function () {
//     document.querySelector(".keyword-tooltiptext").style.visibility = "hidden";
//   });
// document
//   .querySelector(".input--location")
//   .addEventListener("click", function () {
//     document.querySelector(".location-tooltiptext").style.visibility = "hidden";
//   });
const errorHandler = function () {
  errMsg.classList.remove("hidden");
};
const resultShow = function (data, nameIdDict) {
  let tableEl = `
  <table class="result-table">
  <thead class="result-table-head">
  <tr>
    <th>No.</th>
    <th>Images</th>
    <th class="th-sort-name"><span>Business Name</span></th>
    <th class="th-sort-rating"><span>Rating</span></th>
    <th class="th-sort-distance"><span>Distance(miles)</span></th>
  </tr>
  </thead>
  <tbody>
  `;
  // body.insertAdjacentHTML("beforeend", tableEl);
  let i = 1;
  Object.values(data).forEach(function (value) {
    // console.log(value);
    tableEl += `
    <tr>
      <td>${i}</td>
      <td class="img-cell"><img src=${
        value.image_url
      } height=100px width=100px></img></td>
      <td class="business-name-cell" id="${nameIdDict[value.name]}"><span>${
      value.name
    }</span></td>
      <td>${value.rating}</td>
      <td>${(value.distance / 1609.34).toFixed(2)}</td>
    </tr>
    `;
    i = i + 1;
  });
  tableEl += `
  </tbody>
  </table>
  `;
  body.insertAdjacentHTML("beforeend", tableEl);
  // tableEl.classList.remove("hidden");
};
const renderDict = function (data, dict) {
  for (let key in data) {
    let value = data[key];
    dict[value.name] = key;
  }
  console.log(dict);
  return dict;
};
const detailsShow = function (data) {
  const d = document.querySelector(".section-detail");
  if (typeof d != "undefined" && d != null) {
    body.removeChild(d);
  }
  let close_status = "";
  if (data.is_closed == false && data.is_claimed == true) {
    close_status = "Open Now";
    // status_color = rgb(23, 109, 27);
  } else {
    close_status = "Closed";
    // status_color = rgb(255, 0, 0);
  }

  let detailEl = `
  <div class="section-detail">
    <h3>${data.name}</h3>
    <div class="detail-text">
    <div class="detail-text-cell">
      <p>Status</p>
  `;
  if (close_status == "Open Now") {
    detailEl += `<div class="status-tag" style="background-color:rgb(23,109,27)">${close_status}</div>`;
  }
  if (close_status == "Closed") {
    detailEl += `<div class="status-tag" style="background-color:rgb(255,0,0)">${close_status}</div>`;
  }
  detailEl += `</div>`;
  if (typeof data.categories != "undefined" && data.categories != null) {
    detailEl += `
      <div class="detail-text-cell">
        <p>Category</p>
        <div>${data.categories[0].title}</div>
      </div>
    `;
  }
  detailEl += ` 
    <div class="detail-text-cell">
      <p>Adress</p>
      <div>${
        data.location.address1 +
        data.location.address2 +
        data.location.address3 +
        "," +
        data.location.state +
        " " +
        data.location.zip_code
      }</div>
    </div>
    <div class="detail-text-cell">
      <p>Phone Number</p>
      <div>${data.display_phone}</div>
    </div>`;
  if (
    typeof data.transactions != "undefined" &&
    data.transactions != null &&
    data.transactions.length != 0
  ) {
    detailEl += `
      <div class="detail-text-cell">
        <p>Transactions Supported</p>
        <div>${data.transactions}</div>
      </div>`;
  }
  if (typeof data.price != "undefined" && data.price != null) {
    detailEl += `
      <div class="detail-text-cell">
      <p>Price</p>
      <div>${data.price}</div>
    </div>
      `;
  }
  detailEl += `
    <div class="detail-text-cell">
      <p>More info</p>
      <a href=${data.url} target="_blank">Yelp</a>
    </div>
    </div>
    <div class="detail-images">
  `;
  for (let i = 1; i <= data.photos.length; i++) {
    detailEl += `      
    <div class="detail-img">
        <img src=${data.photos[i - 1]} width=200px></img>
        <span>Photo ${i}</span>
    </div>
    `;
  }
  detailEl += `
    </div>
  </div>
  `;
  body.insertAdjacentHTML("beforeend", detailEl);
  document
    .querySelector(".section-detail")
    .scrollIntoView({ behavior: "smooth" });
};
let name_asc = false;
let rating_asc = false;
let distance_asc = false;
/*Sort by Column*/
/*Reference:  https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table*/
const sortTable_Name = function (tableEl) {
  let switching = true;
  let shouldSwitch = false;
  let i = 1;
  while (switching) {
    switching = false;
    let rows = tableEl.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      let name_x = rows[i].querySelectorAll("td")[2];
      let name_y = rows[i + 1].querySelectorAll("td")[2];
      if (name_asc === false) {
        if (name_x.innerHTML.toLowerCase() > name_y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (name_x.innerHTML.toLowerCase() < name_y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  if (name_asc === false) {
    name_asc = true;
  } else {
    name_asc = false;
  }
};
const sortTable_Rating = function (tableEl) {
  let switching = true;
  let shouldSwitch = false;
  let i = 1;
  while (switching) {
    switching = false;
    let rows = tableEl.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      let r_x = rows[i].querySelectorAll("td")[3];
      let r_y = rows[i + 1].querySelectorAll("td")[3];
      if (rating_asc === false) {
        if (r_x.innerHTML > r_y.innerHTML) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (r_x.innerHTML < r_y.innerHTML) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  if (rating_asc === false) {
    rating_asc = true;
  } else {
    rating_asc = false;
  }
};
const sortTable_Distance = function (tableEl) {
  let switching = true;
  let shouldSwitch = false;
  let i = 1;
  while (switching) {
    switching = false;
    let rows = tableEl.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      let d_x = rows[i].querySelectorAll("td")[4];
      let d_y = rows[i + 1].querySelectorAll("td")[4];
      if (distance_asc === false) {
        if (Number(d_x.innerHTML) > Number(d_y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (Number(d_x.innerHTML) < Number(d_y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
  if (distance_asc === false) {
    distance_asc = true;
  } else {
    distance_asc = false;
  }
};
const resumeNO = function (tableEl) {
  const rows = tableEl.rows;
  for (let i = 1; i < rows.length; i++) {
    rows[i].cells[0].innerHTML = i;
  }
};
/*******************************************************************************/
const getGeolocationByIpinfo = function (ipinfo_token) {
  const geolocation = fetch(`https://ipinfo.io/json?token=${ipinfo_token}`)
    .then((response) => {
      // console.log(response.json());
      return response.json();
    })
    .then((data) => {
      console.log(data.city);
      console.log(typeof data.loc);
      return data.loc;
    });
  return geolocation;
};
const getGeolocationByAddress = function (gmap_key) {
  const address = locEl.value;
  const geolocation = fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?language=en&address=${address}&key=${gmap_key}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data.results[0].geometry.location);
      // console.log(typeof data.results[0].geometry.location.lat);
      console.log(data.results[0].formatted_address);
      return data.results[0].geometry.location;
    });
  return geolocation;
};
const searchDetails = function (nameIdDict) {
  let newtableEl = document.querySelector("table");
  let rows = newtableEl.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    let currentRow = newtableEl.rows[i];
    const Handler = function (row) {
      return function () {
        let id = row.querySelector(".business-name-cell").id;
        console.log(id);
        return fetch(`/detailsyelp?id=${id}`, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            //show details
            detailsShow(data);
          });
      };
    };
    currentRow.onclick = Handler(currentRow);
  }
  // for (
  //   let i = 0;
  //   i < newtableEl.querySelectorAll(".business-name-cell").length;
  //   i++
  // ) {
  //   newtableEl
  //     .querySelectorAll(".business-name-cell")
  //     [i].addEventListener("click", function () {
  //       let id = newtableEl.querySelectorAll(".business-name-cell")[i].id;
  //       console.log(id);
  //       return fetch(`/detailsyelp?id=${id}`, {
  //         method: "GET",
  //       })
  //         .then((response) => {
  //           return response.json();
  //         })
  //         .then((data) => {
  //           console.log(data);
  //           //show details
  //           detailsShow(data);
  //         });
  //     });
  // }
};
checkEl.addEventListener("change", function () {
  if (this.checked) {
    document.querySelector(".location-tooltiptext").style.visibility = "hidden";
    locEl.style.backgroundColor = "#aaa";
    locEl.disabled = true;
    locEl.value = "";
    getGeolocationByIpinfo(ipinfo_token);
  } else {
    locEl.style.backgroundColor = "white";
    locEl.disabled = false;
  }
});
clearEl.addEventListener("click", function () {
  keywordEl.value = "";
  distEl.value = "10";
  categoryEl.value = "default";
  locEl.value = "";
  locEl.disabled = false;
  locEl.style.backgroundColor = "white";
  checkEl.checked = false;
  errMsg.classList.add("hidden");
  // if (body.contains(tableEl)) tableEl.add("hidden");
  const t = document.querySelector("table");
  if (typeof t != "undefined" && t != null) {
    body.removeChild(t);
  }
  const d = document.querySelector(".section-detail");
  if (typeof d != "undefined" && d != null) {
    body.removeChild(d);
  }
  // document.querySelector(".keyword-tooltiptext").style.visibility = "hidden";
  // document.querySelector(".location-tooltiptext").style.visibility = "hidden";
});

let nameIdDict = new Object();

submitEl.addEventListener("click", function (e) {
  if (!errMsg.classList.contains("hidden")) {
    errMsg.classList.add("hidden");
  }
  const t = document.querySelector("table");
  if (typeof t != "undefined" && t != null) {
    body.removeChild(t);
  }
  const d = document.querySelector(".section-detail");
  if (typeof d != "undefined" && d != null) {
    body.removeChild(d);
  }
  //document.querySelector(".keyword-tooltiptext").style.visibility = "hidden";
  //document.querySelector(".location-tooltiptext").style.visibility = "hidden";
  nameIdDict = {};
  if (checkEl.checked) {
    if (
      document.forms["myForm"]["keyword"].value == "" ||
      document.forms["myForm"]["distance"].value == "" ||
      document.forms["myForm"]["category"].value == ""
    ) {
      return;
    } else {
      e.preventDefault();
    }
    getGeolocationByIpinfo(ipinfo_token)
      .then((data) => {
        const lat = Number(data.split(",")[0]);
        const lng = Number(data.split(",")[1]);
        return fetch(
          `/searchyelp?key=${keywordEl.value}&lat=${lat}&lng=${lng}&distance=${distEl.value}&category=${categoryEl.value}`,
          { method: "GET" }
        );
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (JSON.stringify(data) == "{}") {
          throw new Error(`No valid Results found.`);
        } else {
          nameIdDict = renderDict(data, nameIdDict);
          resultShow(data, nameIdDict);
          let tableEl = document.querySelector("table");
          tableEl.scrollIntoView({ behavior: "smooth" });
          let name_asc = false;
          // sortOnClickEnable(tableEl);
          tableEl
            .querySelector(".th-sort-name")
            .addEventListener("click", function () {
              sortTable_Name(tableEl);
              resumeNO(tableEl);
              tableEl = document.querySelector("table");
            });
          tableEl
            .querySelector(".th-sort-rating")
            .addEventListener("click", function () {
              sortTable_Rating(tableEl);
              resumeNO(tableEl);
              tableEl = document.querySelector("table");
            });
          tableEl
            .querySelector(".th-sort-distance")
            .addEventListener("click", function () {
              sortTable_Distance(tableEl);
              resumeNO(tableEl);
              tableEl = document.querySelector("table");
            });
          searchDetails(nameIdDict);
        }
      })
      .catch((err) => {
        errorHandler();
      });
  } else {
    if (document.forms["myForm"]["distance"].value == "") {
      return;
    } else if (document.forms["myForm"]["location"].value == "") {
      return;
    } else if (document.forms["myForm"]["keyword"].value == "") {
      return;
    } else if (document.forms["myForm"]["category"].value == "") {
      return;
    } else {
      e.preventDefault();
    }
    getGeolocationByAddress(gmap_key)
      .then((data) => {
        const lat = data.lat;
        const lng = data.lng;
        return fetch(
          `/searchyelp?key=${keywordEl.value}&lat=${lat}&lng=${lng}&distance=${distEl.value}&category=${categoryEl.value}`,
          { method: "GET" }
        );
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (JSON.stringify(data) == "{}") {
          throw new Error(`No valid Results found.`);
        } else {
          nameIdDict = renderDict(data, nameIdDict);
          resultShow(data, nameIdDict);
          let tableEl = document.querySelector("table");
          tableEl.scrollIntoView({ behavior: "smooth" });
          // sortOnClickEnable(tableEl);
          tableEl
            .querySelector(".th-sort-name")
            .addEventListener("click", function () {
              sortTable_Name(tableEl);
              resumeNO(tableEl);
              tableEl = document.querySelector("table");
            });
          tableEl
            .querySelector(".th-sort-rating")
            .addEventListener("click", function () {
              sortTable_Rating(tableEl);
              resumeNO(tableEl);
              tableEl = document.querySelector("table");
            });
          tableEl
            .querySelector(".th-sort-distance")
            .addEventListener("click", function () {
              sortTable_Distance(tableEl);
              resumeNO(tableEl);
              tableEl = document.querySelector("table");
            });
          searchDetails(nameIdDict);
        }
      })
      .catch((err) => {
        errorHandler();
      });
  }
  /* Handle exception */
  /* Handle no result case*/
});

// http://127.0.0.1:5000/detailsyelp?id=3IoIViOW1W38eQOPWm0_DA
// http://127.0.0.1:5000/searchyelp?key=sushi&lat=34.03&lng=-118.28&distance=5&category=food
