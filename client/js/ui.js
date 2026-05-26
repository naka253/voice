function showTab(tabName) {

  document.getElementById("roomsTab")
  .style.display = "none";

  document.getElementById("usersTab")
  .style.display = "none";

  document.getElementById("settingsTab")
  .style.display = "none";

  if (tabName === "rooms") {

    document.getElementById("roomsTab")
    .style.display = "block";
  }

  if (tabName === "users") {

    document.getElementById("usersTab")
    .style.display = "block";
  }

  if (tabName === "settings") {

    document.getElementById("settingsTab")
    .style.display = "block";
  }
}