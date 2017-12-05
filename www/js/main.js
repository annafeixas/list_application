
var info = null;


cordova.plugins.notification.local.hasPermission(function (granted) {
});

cordova.plugins.notification.local.registerPermission(function (granted) {
});

cordova.plugins.notification.local.on("click", function (notification) {
    alert(notification.text);
}, scope);

document.addEventListener("deviceready", function(){
if(!localStorage.getItem("rp_data"))
{
  var rp_data = {data: []};
  localStorage.setItem("rp_data", JSON.stringify(rp_data));
}

info = JSON.parse(localStorage.getItem("rp_data"));
}, false);

function add_reminder()
{
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var title = document.getElementById("title").value;
    var message = document.getElementById("message").value;

    if(date == "" || time == "" || title == "" || message == "")
    {
      window.alert("Please enter all details");
      return;
    }

    var schedule_time = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    schedule_time = new Date(schedule_time);

    var id = info.data.length;
	var granted;
    cordova.plugins.notification.local.hasPermission(function(granted){
      if(granted == true)
      {
        
		schedule(id, title, message, schedule_time);
      return;
      }
      else
	  
      {
		  
		  
        cordova.plugins.notification.local.registerPermission(function(granted) {
            if(granted == true)
            {
				
              schedule(id, title, message, schedule_time);
			  
            }
            else
            {
              navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
			 
            }
        });
      }
    });
}
function schedule(id, title, message, schedule_time)
{
    cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        message: message,
        at: schedule_time
    });

    var array = [id, title, message, schedule_time];
    info.data[info.data.length] = array;
    localStorage.setItem("rp_data", JSON.stringify(info));

    navigator.notification.alert("Reminder added successfully")
}


 $(document).on("pagebeforeshow","#all",function(){

    var html = '';

    for(var count = 0; count < info.data.length; count++)
    {
        html = html + "<tr><td>" + info.data[count][1] + "</td><td>" + info.data[count][3] + "</td></tr>";

    }

    $("table#allTable tbody").empty();
    $("table#allTable tbody").append(html).closest("table#allTable").table("refresh").trigger("create");  
});


