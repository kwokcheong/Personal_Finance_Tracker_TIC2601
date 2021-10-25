window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

function toggleDisable(){
    let radio = document.getElementById("no_recurring");
    let datefield = document.getElementById("r_date");
    let datefield2 = document.getElementById("r_date2");
    let datebox = document.getElementById("date1");
    let datebox2 = document.getElementById("date2");
    if (radio.checked){
        datefield.disabled = true;
        datefield2.disabled = true;
        datebox.hidden = true;
        datebox2.hidden = true;
    } else {
        datefield.disabled = false;
        datefield2.disabled = false;
        datebox.hidden = false;
        datebox2.hidden = false;
    }
};