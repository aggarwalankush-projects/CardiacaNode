$(window).load(function(){
  if(window.location.hash == '#cardiac_data'){
    startTimer();  
    startCodeTimer();
      $('#pname').html(localStorage.getItem("patient_last_name"));
      $('#pmrn').html(localStorage.getItem("patient_mrn"));
    // $('#myModal').modal('show');
  }
});


 function loadXMLDoc()
  {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
      }
    }
    xmlhttp.open("GET","http://localhost:8080/RestfulWebservice/rs/service/getSomething?request=Hello",true);
    xmlhttp.send();
  }

function createRequest(flag_v)
{
  if(flag_v == true)
  {
      var myObj = {};


      /*
      myObj["Name"] = document.getElementById("fullname").value;
      myObj["Dob"] = document.getElementById("bday").value;
      myObj["Gender"] = document.getElementById("gender").value;
      myObj["Age"] = document.getElementById("age").value;
      myObj["Email"] = document.getElementById("email").value;
*/
      // var patient={};
      // patient['lastname']=document.getElementById('lastname').value;
      // patient['mrn']=document.getElementById('mrn').value;
      // var request = "info=patient&request=";
      // var json = request.concat(JSON.stringify(patient));
      // $.post("http://localhost:8080/RestfulWebservice/rs/service/postSomething",
      //       json);
      // sessionStorage.setItem("patientId","MRN12457896");
    //alert(json);
    //send_code_data_to_server();
  }
  // load_jqxdropdown();


    localStorage.setItem("patient_last_name", document.getElementById('lastname').value);
    localStorage.setItem("patient_mrn", document.getElementById('mrn').value);

    console.log(localStorage.getItem("patient_last_name"));
    console.log(localStorage.getItem("patient_mrn"));

  window.location = "#cardiac_data";
  window.location.reload();
}

function epi_click(evt){
  //alert('hi');
  var count = 0;
  var min = 0;
  var sec = 0;
  var flag = false;
    var timer = $.timer(
      function() {
        count++;
        sec++;
        if(count%60 == 0)  //1 min
        {
          min++;
          flag = true;
          sec = 0;
        }
        evt.innerHTML = 'EPI:' + min + ":" + count%60;
        var sec2=count%60;
        if(min%1==0 && sec2<=15 && sec2%2==0){
        //every 4 minutes,
          evt.style.backgroundColor='red';
        }else{
          evt.style.backgroundColor='white';
        }
        if(flag == false)
          return;
      },
      1000,
      true
    );
  }


var timer = null;
var CPRflashInterval = null;
function startTimer()
{
  
  var count = 0;
  var min_2 = 1;
  var min_1 = 0;
  var sec = 0;
  var flag = false;
  var hr = 0;
  var row;

  if(timer != null){
    timer.stop();
    timer = null;
  }

  timer = $.timer(
      function() {

        count++;
        sec++;
        //hightlight eh current row
        var table_rows = $("#table_body").children();
        if(count%60 == 0){
          min_1++;
          sec = 0;
          if(min_1%60 == 0){
            hr++;
            min_1 = 0; 
          }
        }

        if(count%120 == 0)  //2 min
        {
          
          min_2++;
          flag = true;
        }

        if(sec < 10)
          $("#cpr").html('CPR:' + '00:' + '0'+(min_1%2) + ":0" + sec);
        else
          $("#cpr").html('CPR:' + '00:' + '0'+(min_1%2) + ":" + sec);
        
        if(min_1%2 != 0 && sec >= 30 ) {
          //highlight CPR
            if(CPRflashInterval == null && $("#cpr").hasClass('activecpr')) {
                CPRflashInterval = $.timer(function() {
                  flashtext($('#cpr'),'rgb(255, 0, 0)');
                },
                500,
                true
              );
            }
            if(!$("#cpr").hasClass('activecpr')) {
              $("#cpr").css('background-color', 'white');
            }
        }
        else{
          //dont highlight CPR
          $("#cpr").addClass('activecpr');
          if(CPRflashInterval != null){
            CPRflashInterval.stop();
            CPRflashInterval = null;
          }
          $("#cpr").css('background-color', 'white');
        }
        //$("#code").html('CODE:' + hr + ':' + min_1 + ":" + sec);
        // if(min_2 < 4){
        //   if(min_2 >= 1){
        //     row = table_rows[min_2 - 1];
        //     $(row).css('background-color', 'white');
        //   }
        if(min_2 == 1){
          row = table_rows[1];
          $(row).css('background-color', 'red'); 
        }
          
        // }
          
        if(flag == true && min_2 >= 2){  
          var elements = document.getElementById("ca_row_hidden");
          var time = $(elements).children()[0];
          time.id = 'time' + count;
          // var t = ((min_2-1)*2) + ":" + sec + '0';

          $(time).html(get_cpr_time());
          var str = nodeToString(elements, 'ca_row', min_2, false);

          flag = false;
          $('#table_body').prepend(str);

          //copy values of bolus selections in new row
          var prev_bolus = $('#'+'ca_row-' + (min_2-1)).children()[4];
          var curr_bolus = $('#'+'ca_row-' + min_2).children()[4];
          var bolus_count = $(prev_bolus).find('select').filter('[name=bolus]').toArray().length;
          var i;
          for(i =0; i <bolus_count; i++) {
            $(curr_bolus).find('select').filter('[name=bolus]').toArray()[i].value 
                                          = $(prev_bolus).find('select').filter('[name=bolus]').toArray()[i].value;
          }

          table_rows = $('#table_body').children();

          row = table_rows[1];
          $(row).css('background-color', 'white');

          if(min_2 == 2){
            row = table_rows[2];
            $(row).css('background-color', 'white'); 
          }
              
          row = table_rows[0];
          $(row).css('background-color', 'red');
         
          addCprPanel();
          // $('.cardiac-table-body').scrollTop(10000);     
        }
      },
      1000,
      true
    );
}

var my_node = 0;
var node = 0;
var c_id = 0;
var c = 0;
var n;

function onclick_handler(el)
{
    

    if(el.id == 'add_new')
    {
      var elements = document.getElementById("ca_row_hidden");
      if(my_node == 0)
      {
        my_node = elements.children[3];
        n = my_node.children[0];
      }
     c++;
     var wrapper= document.createElement('div');
      wrapper.innerHTML= my_node.innerHTML;
      var div= wrapper.children[0];
      div.id = c;
     el.parentElement.parentElement.appendChild(div);
    }
    else if(el.id == 'delete')
      $(el).closest('.parent_fill').remove();
    else{
      if(el.className.indexOf('add_new_monitoring')!= -1){
        var elements = document.getElementById("ca_row_hidden");
        node = elements.children[2];  //monitoring
      }else if(el.className.indexOf('add_new_intervention') != -1 ) {

          var elements = document.getElementById("ca_row_hidden");
          node = elements.children[3];  //intervention
            
      }else if(el.className.indexOf('add_new_bolus') != -1){
        var elements = document.getElementById("ca_row_hidden");
        node = elements.children[4];  //monitoring
      }

      c_id++;
      var wrapper= document.createElement('div');
      wrapper.innerHTML= node.innerHTML;
      var div= wrapper.children[0];
      div.id = c_id;
      el.id = "delete";
      $(el).closest('td').append(div);
      $(el).find('.icon-add').hide();
      $(el).find('.icon-remove').show();
    }
  } 

function add_new_control(el)
{
    el.parentElement.innerHTML = el.parentElement.innerHTML + '<div class="portrait" id="delete" onclick="add_new_control(this);"> <input type="text" name="data" id="Pulse_check_data"/> <img src="/Users/shashi/Desktop/shashi/course_material/advance_project/Jquery/delete.png"> </div>';
    //alert("shashi");
}
function handle_select_change(el)
{
  if(el.id == 'Intervention')
  {
    if(el.value == 'Defrib')
    {
      el.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].disabled=false;
      el.parentElement.parentElement.parentElement.parentElement.children[1].className = "text_class";
      el.parentElement.parentElement.parentElement.parentElement.children[2].className = "text_class hidden";
      //el.parentElement.style.width='40%';
       //add text
      //el.parentElement.parentElement.parentElement.parentElement.children[1].innerHTML+='<input type="text"  name="monitoring" id="monitoring">';
    }

    else if(el.value == 'Airway')
    {
     el.parentElement.parentElement.parentElement.parentElement.children[2].className = "text_class";
      el.parentElement.parentElement.parentElement.parentElement.children[1].className = "text_class hidden";

    }
      //add drop down
    else
    {
      el.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].disabled=true;
      el.parentElement.parentElement.parentElement.parentElement.children[1].className = "text_class";
      el.parentElement.parentElement.parentElement.parentElement.children[2].className = "text_class hidden";
      //remove
    // el.parentElement.style.width='0%';
   }

   // alert(el.value);
  }
  if(el.name == 'Rhythm')
  {

      if(el.value == 'PEA' || el.value == 'Asystole' || el.value == 'Vtach/Vfib')
      {
          el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].children[0].children[0].innerHTML = 'Manual';
          el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].children[0].children[1].options[3].disabled = true;
      }
      else
      {
        el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].children[1].options[3].disabled = false;

      }
  }
  //else
  //el.children[0].children[0].children[0].innerHTML = el.children[0].children[0].children[1].value;
    el.parentElement.children[0].innerHTML=el.value;
  //  alert('reached');
}


function nodeToStr(node) {
   var tmpNode = document.createElement( "div" );
   tmpNode.appendChild(node.cloneNode(true));
   var node = tmpNode.children[0];
   var str = tmpNode.innerHTML;
   tmpNode = node = null; // prevent memory leaks in IE
   return str;
}

function nodeToString (node, class_name, id, is_panel) {
  var tmpNode = document.createElement( "div" );
  tmpNode.appendChild(node.cloneNode(true));
  var node = tmpNode.children[0];
  node.removeAttribute("class");

  if(is_panel)
    node.className = 'panel panel-default ' + class_name;   
  else
    node.className = class_name;

  if(id > 1){
    var prev_node_id = class_name + '-' + (id-1);
    if(is_panel == false) {
      var bolus = $('#'+prev_node_id).children()[4];
      node.removeChild(node.children[4]);
      node.appendChild(bolus.cloneNode(true));
    }
    
  }
  node.id = class_name + '-' + id;
  var str = tmpNode.innerHTML;
  tmpNode = node = null; // prevent memory leaks in IE
  return str;
}


function toggle_handler(node)
{
    var c = node.className;
    var pos = c.search("active");
    if(pos ==  -1)
    {
      //add active class to node
      node.className += ' active';
      node.style.backgroundColor = "rgb(151, 216, 156)";
    }
    else
    {
      //remove active class from node
      node.className = 'ui-btn ui-shadow ui-corner-all';
      node.style.backgroundColor = "#f6f6f6";

    }
    /*node.toggleClass('active');*/
}

function get_cpr_time(){
  var hr = '';
  var min = '';
  var sec = '';
  

  if(code_hr < 10)
    hr = '0';
  // if(code_min < 10)
  //   min = '0';
  if(code_sec < 10)
    sec = '0';

  hr += code_hr; 

  if(code_sec == 59){
    min = code_min + 1;
    sec = '00';  
  }
  else{
    min += code_min; 
    sec += code_sec; 
  }

  if(min < 10)
    min = '0' + min;
    
  return hr + ':' + min + ':' + sec;
}

//compression restarted flash interval  
var flashInterval;
var popuptimeout;
var interruptedTimeout;
var compression_popup_cnt = 0;
function compression_handler(el){

  if(el.id == "compression_restarted") {
     $("#compression_restarted").addClass("active");  
     $("#compression_interrupted").removeClass("active");  
     $('.compression_popup').addClass('compression_popup_hide');
     stopFlash($('#compression_restarted'));
     $('#compression_restarted').css('background-color', '#E6E6E6');
  } 
  else if(el.id == "compression_interrupted") {
      $('#compression_restarted').css('background-color', 'white');
      $("#compression_restarted").removeClass("active");  
      $("#compression_interrupted").addClass("active"); 
      //timer to check if compression interrupted is clicked for more than 10 seconds 
      interruptedTimeout = setTimeout(function() {   
          //check if compression restarted or not
          if (!$("#compression_restarted").hasClass("active")) {
            //if pop has been shown more than 10 seconds hide the popup 
            popuptimeout = setTimeout(function() {
              // $('.compression_popup').addClass('compression_popup_hide');
              stopFlash($('#compression_restarted'));
              $('#compression_restarted').css('background-color', 'white');
            },10000);

            // $('.compression_popup').removeClass('compression_popup_hide');

            var elements = document.getElementById("compression-popup-template");
            var str = nodeToString(elements, 'compression-popup', compression_popup_cnt, true);
            $('#accordion').prepend(str);
            var id = '#compression-popup-'+ compression_popup_cnt;
            $(id).find('.compression-popup-ask-time').html(get_cpr_time());
            compression_popup_cnt++;     
            
            


            if(flashInterval != null)
              clearInterval(flashInterval);
            flashInterval = setInterval(function() {
                flashtext($('#compression_restarted'),'rgb(255, 0, 0)');
            }, 500 ); //set an interval timer up to repeat the function
          }
      }, 10000);
  }
}

function stopFlash(ele) {
  clearTimeout(popuptimeout);
  clearTimeout(interruptedTimeout);
  if(flashInterval != null)
  {
    clearInterval(flashInterval);
    flashInterval = null;
  }
  // ele.css('background-color', 'transparent');
}

function flashtext(ele,col) {
  //if (flashInterval == null)
   // return;
  var tmpColCheck = ele.css('background-color');
  if (tmpColCheck == col) {
    ele.css('background-color', 'white');
  } else {
    ele.css('background-color', col);
  }
}

function notifcation_handler(el) {
  if(el.value.toLowerCase() == 'manual') {
    console.log('notifcation_handler');
    showNotification('Notify team-leader & Check compression quality. Consider new CPR provider or Mechanical CPR');
  }
}

function showNotification(msg) {
  console.log('showNotification');
  $('.notification').addClass('show');
  $('.notification-content').html(msg);
  // setTimeout(function() {
  //   hide_notification();
  // }, 10000);
  //$(".notification").fadeOut('slow');
}

function hide_notification() {
  $(".notification").removeClass('show');
}

function goodPulseHandler(el) {
  //hide compression panel and all the panels below
  $('.pulse-label').html(get_cpr_time());
  $('.compression-panel').addClass('hide');
  $('.cardiac-rhythm-panel').addClass('hide');
  $('.epi-panel').addClass('hide');
  $('.vt-vf-inst-panel').addClass('hide');
  $('.defib-panel').addClass('hide');
  hide_notification();
}

var compression_panel_cnt = 1;
function badPulseHandler(el) {
  //show compression-panel pop up
  $('.pulse-label').html(get_cpr_time());
  $('.compression-ask-label').html(get_cpr_time());
  // $('.compression-label').html('00:00:00');
  if($(el).data('panel') === false){
    $(el).data('panel', true);
    var elements = document.getElementById("compression-panel-template");
    var str = nodeToString(elements, 'compression-panel', compression_panel_cnt, true);
    compression_panel_cnt++;
    $('#accordion').prepend(str);
  }
  else
    $('.compression-panel').removeClass('hide');
}

var cardiac_rhythm_panel_cnt = 1;
function compressionNowHandler(el) {
  //show cardiac rhythm panel 
  $('.compression-label').html(get_cpr_time());
  $('.rhythm-ask-label').html(get_cpr_time());
  // $('.rhythm-label').html('00:00:00');
  showNotification('Place backboard & Place defibrillator pads');
  
  if($(el).data('panel') === false){
    $(el).data('panel', true);
    var elements = document.getElementById("cardiac-rhythm-panel-template");
    var str = nodeToString(elements, 'cardiac-rhythm-panel', cardiac_rhythm_panel_cnt, true);
    cardiac_rhythm_panel_cnt++;
    $('#accordion').prepend(str);
  }
  else
    $('.cardiac-rhythm-panel').removeClass('hide');
  $('#text_compression_time').val(get_cpr_time());
}

function cprAbortedHandler(el) {
  //remove cardiac-rhtym panel and  all the pop panels below this
  $('.compression-label').html(get_cpr_time());

  $('.cardiac-rhythm-panel').addClass('hide');
  $('.epi-panel').addClass('hide');
  $('.vt-vf-inst-panel').addClass('hide');
  $('.defib-panel').addClass('hide');
  $('#text_compression_time').val('');
  hide_notification();
}

var vt_vf_panel_cnt = 1;
var epi_panel_cnt = 1;
var defib_panel_cnt = 1;

function cardiacRhythmChangeHandler(el) {
  var ca_rhythm = el.value.toLowerCase();
  $('.rhythm-label').html(get_cpr_time());

  if (ca_rhythm == 'vt' || ca_rhythm == 'vf') {
    //two pop ups related to defib
      if($(el).data('defibpanel') === false){
        $(el).data('defibpanel', true);
        $('.vt-vf-ask-time').html(get_cpr_time());
        $('.defib-ask-time').html(get_cpr_time());
        // $('.defib-label').html('00:00:00');
        var elements = document.getElementById("defib-panel-template");
        var str = nodeToString(elements, 'defib-panel', defib_panel_cnt, true);
        defib_panel_cnt++;
        $('#accordion').prepend(str);
      }    
      else {
        $('.defib-panel').removeClass('hide');
      }  

      if($(el).data('vtpanel') === false){
        $(el).data('vtpanel', true);
        var elements = document.getElementById("vt-vf-panel-template");
        var str = nodeToString(elements, 'vt-vf-inst-panel', vt_vf_panel_cnt, true);
        vt_vf_panel_cnt++;
        $('#accordion').prepend(str);
      }
      else
        $('.vt-vf-inst-panel').removeClass('hide');

      $('.epi-panel').addClass('hide');
      $('.cpr-panel').addClass('hide');
      //clear previous selection for cpr & epi
      $('.radio-epi').prop('checked', false);
      $('.radio-cpr').prop('checked', false);
  }
  else {
      if (ca_rhythm == 'bradycardia') {
          showNotification('Instruct meds nurse & Prepare atropine');
      }
      else {
          hide_notification();
      }
      //besides vt /vf, show epi panel
      if($(el).data('epipanel') === false){
        $(el).data('epipanel', true);
        
        var elements = document.getElementById("epi-panel-template");
        var str = nodeToString(elements, 'epi-panel', epi_panel_cnt, true);
        epi_panel_cnt++;
        $('#accordion').prepend(str);
      }
      else {
        $('.epi-panel').removeClass('hide');
        // $('.epi-ask-time').html('00:00:00');
      }
      $('.epi-ask-time').html(get_cpr_time());
      // $('.epi-label').html('00:00:00');
      $('.vt-vf-inst-panel').addClass('hide');
      $('.defib-panel').addClass('hide');
  }
}

function defibPerformedHandler(el) {
  $('#text_defibrillation_time').val(get_cpr_time());
  $('.defib-label').html(get_cpr_time());
}

function notInVTVFHandler(el) {
  $('#text_defibrillation_time').val('');
  $('.defib-label').html(get_cpr_time());
}

var cpr_panel_cnt = 1;
function epi_handler(el){
  $('.epi-label').html(get_cpr_time());
  //startTimer();

  if($(el).data('cprpanel') === false){
    $(el).data('cprpanel', true);
    var elements = document.getElementById("cpr-panel-template");
    console.log(elements);
    var str = nodeToString(elements, 'cpr-panel', cpr_panel_cnt, true);
    $('#accordion').prepend(str);
    var id = '#cpr-panel-'+ cpr_panel_cnt;
    $(id).data('row', '#ca_row-'+cpr_panel_cnt);
    cpr_panel_cnt++;
  }
  else
    $('.cpr-panel').removeClass('hide');
  $('.cpr-ask-time').html(get_cpr_time());
}

function addCprPanel() {
    var elements = document.getElementById("cpr-panel-template");
    var str = nodeToString(elements, 'cpr-panel', cpr_panel_cnt, true);
    $('#accordion').prepend(str);

    var id = '#cpr-panel-'+ cpr_panel_cnt;
    $(id).find('.radio-cpr').attr('name','radio-cpr-' + cpr_panel_cnt);
    $(id).data('row', '#ca_row-'+cpr_panel_cnt);
    cpr_panel_cnt++;
    $(id).find('.cpr-ask-time').html(get_cpr_time());
}

var code_min = 0;
var code_sec = 0;
var code_hr = 0;
var code_timer = null;

function startCodeTimer(){
  code_timer = $.timer(function(){
    code_sec++;
    if(code_sec%60 == 0){
      code_min++;    
      
      if(code_min%60 == 0){
        code_min = 0;
        code_hr++;
      }
      code_sec = 0;
    }

    $("#code").html('CODE:' + get_cpr_time());
  },
  1000, true);
}

var monitor_panel_cnt = 1;
function cprhandler(el){
  var row = $(el).closest('.cpr-panel').data('row');
    $(row).find('#cpr-col').data('time', get_cpr_time());

  $(row).find('#speed').val($(el).val());
  //console.log(row);
  if($(el).closest('.container').data('monitorpanel') === false){
    $(el).closest('.container').data('monitorpanel', true);
    $('#cpr-panel-1').closest('.panel').find('.cpr-ask-time');
    var elements = document.getElementById("monitor-panel-template");
    var str = nodeToString(elements, 'monitor-panel', monitor_panel_cnt, true);
    $('#accordion').prepend(str);
    var id = '#monitor-panel-'+ monitor_panel_cnt;
    $(id).find('.radio-monitor').attr('name','radio-monitor-' + monitor_panel_cnt);
    $(id).data('row', '#ca_row-'+monitor_panel_cnt);
    $(id).find('.monitor-ask-time').html(get_cpr_time());
    monitor_panel_cnt++;

  }
  $(el).closest('.panel').find('.cpr-label').html(get_cpr_time());

}

var intervention_panel_cnt = 1;
function monitorhandler(el){
  var row = $(el).closest('.monitor-panel').data('row');
  $(row).find('#monitor').val($(el).val());
    $(row).find('#monitor-col').data('time', get_cpr_time());
  if($(el).closest('.container').data('interventionpanel') === false){
    $(el).closest('.container').data('interventionpanel', true);
    var elements = document.getElementById("intervention-panel-template");
    var str = nodeToString(elements, 'intervention-panel', intervention_panel_cnt, true);
    $('#accordion').prepend(str);
    var id = '#intervention-panel-'+ intervention_panel_cnt;
    $(id).find('.radio-intervention').attr('name','radio-intervention-' + intervention_panel_cnt);
    $(id).data('row', '#ca_row-'+ intervention_panel_cnt);
    $(id).find('.intervention-ask-time').html(get_cpr_time());
    intervention_panel_cnt++;
  }
  else
    $('.monitor-panel').removeClass('hide');
  $(el).closest('.panel').find('.monitor-label').html(get_cpr_time());
}

var bolus_panel_cnt = 1;
function interventionhandler(el){
  var row = $(el).closest('.intervention-panel').data('row');
  $(row).find('#intervention').val($(el).val());
    $(row).find('#intervention-col').data('time', get_cpr_time());
 if($(el).closest('.container').data('boluspanel') === false){
   $(el).closest('.container').data('boluspanel', true);
   var elements = document.getElementById("bolus-panel-template");
   var str = nodeToString(elements, 'bolus-panel', bolus_panel_cnt, true);
   $('#accordion').prepend(str);
   var id = '#bolus-panel-'+ bolus_panel_cnt;
   $(id).find('.radio-bolus').attr('name','radio-bolus-' + bolus_panel_cnt);
   $(id).data('row', '#ca_row-'+ bolus_panel_cnt);
   $(id).find('.bolus-ask-time').html(get_cpr_time());
   bolus_panel_cnt++;
 }
 else
   $('.bolus-panel').removeClass('hide'); 
 $(el).closest('.panel').find('.intervention-label').html(get_cpr_time());
}

function bolushandler(el){
  $(el).closest('.panel').find('.bolus-label').html(get_cpr_time());
  var row = $(el).closest('.bolus-panel').data('row');
    $(row).find('#bolus-col').data('time', get_cpr_time());
  $(row).find('#bolus').val($(el).val());
}

function radiohandler(el){
  console.log('radiohandler');
  // console.log(row_id);

  var option_val = $(el).val();
  var el_id = $(el).attr('id');
  var row_id = $(el).closest('.ca_row').attr('id');
  var row_no = row_id.substring(7, row_id.length);
  var panel_id = '#' + $(el).attr('id') + '-panel-' + row_no;
  var radio_name = 'radio-' + el_id;
  $(panel_id).find('input:radio[name='+ radio_name+']').filter('[value = '+option_val+']').prop('checked', true);
}


function stopcpr() {
  $("#cpr").removeClass('activecpr');
  if(CPRflashInterval != null){
    CPRflashInterval.stop();
    CPRflashInterval = null;
  }
  $("#cpr").css('background-color', 'white');
}

function patient_info() {
    this.patient_last_name = document.getElementById('lastname').value;
    this.patient_mrn = document.getElementById('mrn').value;
    //console.log(this);
    return this;
}

var index_ca_data = 0;
function submit_cpr_data() {
    $('#report-pname').html(localStorage.getItem("patient_last_name"));
    $('#report-pmrn').html(localStorage.getItem("patient_mrn"));
    $('.report-patient-info').css('display', 'block');

    var patient = new patientInfo(localStorage.getItem("patient_last_name"), localStorage.getItem("patient_mrn"));
    console.log(patient);
    var ca_data_array = collect_cardiac_data();
    var ca_data = new cardiac_data(patient, ca_data_array);
    var jsonString = JSON.stringify(ca_data);
    console.log(jsonString);
    

    timer.stop();
    code_timer.stop();
    $('.main-content').css('display', 'none');

    console.log('ca_data');
    console.log(ca_data_array[0]);

    var report_table = $('.report-page');
    var report_body = $('#report-body');
    var report_row = document.getElementById('report-row-template');
    console.log('report-row');
    console.log(report_row);
    var ca_arr_len = ca_data_array.length;
    var i;
    var col_text = '';
    for(i=0; i<ca_arr_len; i++ ){
      var str = nodeToStr(report_row);
      report_body.append(str);
      console.log('child');
      var child = $(report_body.children()[i+1]);
      child.removeClass('row-hidden');
      child.find('.report-time-col').html(ca_data_array[i].cpr_time);
        col_text = update_report_col(ca_data_array[i].cpr);
      child.find('.report-cpr-col').html(col_text);
      
      col_text = update_report_col(ca_data_array[i].monitoring);
      child.find('.report-monitor-col').html(col_text); 

      col_text = update_report_col(ca_data_array[i].intervention);
      child.find('.report-intervention-col').html(col_text);

      col_text = update_report_col(ca_data_array[i].bolus);
      child.find('.report-bolus-col').html(col_text);
    }

    $('#mytable_report').css('display', 'block');


    $.ajax ({
        url: "http://52.27.160.102:3000/savePatientInfo",
        type: "POST",
        data: jsonString,
        success: function(){
          //alert('sucesss');
            console.log("data uploaded successfully");
        },
        fail: function() {
            console.log("data not uploaded successfully");
        }
    });
}


function update_report_col(map){
  var keys = Object.keys(map);
  var arr_len = keys.length;
  var col_text = '';
  for(var j = 0; j < arr_len; j++){
    var key = keys[j];
    col_text += key + ':' + map[key] + '<br>';
  }
  
  return col_text;
}


function collect_cardiac_data() {
  
  var table = document.getElementById('mytable_head');
  var length = $(table).find('> tbody > tr').length;
  var rows = $(table).find('> tbody > tr');
  var ca_data_array =[];
  var index_ca_data = 0;
  for(var row_i = 1; row_i<length;row_i++) {
    var this_id = '#ca_row-' + row_i;
    //row = $(row_id);
    console.log($(this_id)[0].id);

    if ($(this_id)[0].id != 'ca_row_hidden') {
      var cpr_time;

        var cpr_map = {};
      cpr_time = $(this_id).find('td')[0].innerHTML;
      var cpr = $(this_id).find('#speed')[0].value;
      if(cpr == 'Select')
        cpr = "";
        cpr_map['time'] = $(this_id).find('#cpr-col').data('time');
        cpr_map['cpr'] = cpr;
      var mon_count = $(this_id).find('#monitor-col')[0].childElementCount;
      var monitor_map = {};
        monitor_map['time'] =  $(this_id).find('#monitor-col').data('time');
      //monitor_map.time=
      for(var i=0; i<mon_count; i++) {
          var mon_type = $(this_id).find('.monitor-select')[i].value;
          var mon_value = $(this_id).find('.monitor-input')[i].value;
          if(mon_type != 'Select')
            monitor_map[mon_type] = mon_value;
      }
      var intervention_count = $(this_id).find('#intervention-col')[0].childElementCount;
      var intervention_map = {};
        intervention_map['time'] =  $(this_id).find('#intervention-col').data('time');
      for(var i=0; i<intervention_count; i++) {
          var inter_type = $(this_id).find('.intervention-select')[i].value;
          var inter_value = $(this_id).find('.intervention-input')[i].value;
          //intervention_array[i] = new intervention_data(inter_type, inter_value);
          if(inter_type != 'Select')
            intervention_map[inter_type] = inter_value;
      }
      var bolus_count = $(this_id).find('#bolus-col')[0].childElementCount;
      var bolus_map = {};
        bolus_map['time'] =  $(this_id).find('#bolus-col').data('time');
      for(var i=0; i<bolus_count; i++) {
          var bolus_type = $(this_id).find('.bolus-select')[i].value;
          var bolus_value = $(this_id).find('.bolus-input')[i].value;
          if(bolus_type != 'Select')
            bolus_map[bolus_type] = bolus_value;
      }
      ca_data_array[index_ca_data] = new cardiac_row_data(cpr_time, cpr_map, monitor_map, intervention_map, bolus_map);
      index_ca_data++;
    }
  }
  return ca_data_array;
}

function cardiac_data(patientInfo, ca_data_array) {
    this.patient = patientInfo;
    this.ca_data = ca_data_array;
}

function patientInfo(lastname, mrn) {
    this.lastname = lastname;
    this.mrn = mrn;
}

function cardiac_row_data(cpr_time, cpr_map, monitoring, intervention, bolus) {
    this.cpr_time = cpr_time;
    this.cpr = cpr_map;
    this.monitoring = monitoring;
    this.intervention = intervention;
    this.bolus = bolus;
}


