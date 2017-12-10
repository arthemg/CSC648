function addNewUser(){

    $.ajax({
        url:"/fa17g12/api/user",
        type:"post",
        data:$("#the-form").serialize(),
        success:function(res){

            window.location.reload();
            $('#name').val('');     //clear name value
            $('#email').val('');    //clear email value
            return false;
        },
        error:function(xhr, status, error){

            console.log(xhr.responseText);
            var err = '';
            $.each(JSON.parse(xhr.responseText) , function(i, item) {

                err +='<li>'+item.msg+'</li>';
            });
            $(".err-area").html(err);
            return false;
        }


    });
}

function deleteUser(user_id){

    $.ajax({
        url:"/fa17g12/api/user/"+user_id,
        // url:"/api/user/"+user_id,
        type: 'DELETE',
        success: function(res) {

            window.location.reload();
            return false;
        },
        error:function(xhr, status, error){

            console.log(xhr.responseText);
            alert("Error deleting");
            return false;
        }
    });
}

function editUser(user_id) {

    console.log(user_id, 'arg');
    $.ajax({
        url: "/fa17g12/api/user/" + user_id,
        type: "put",
        data: $("#the-form").serialize(),
        success: function (res) {
            window.location.href = '/fa17g12/api/user';
            return false;
        },
        error: function (xhr, status, error) {

            console.log(xhr.responseText);
            var err = '';
            $.each(JSON.parse(xhr.responseText), function (i, item) {

                err += '<li>' + item.msg + '</li>';
            });
            $(".err-area").html(err);
            return false;
        }

    });
}

function searchUser(){
    var user = $('#userSearch').val();
    console.log(user);

    $.ajax({

        url:"/fa17g12/search/" + user,
        // url:"/search/" + user,
        type:"post",
        data:$("#search_form").serialize(),
        success:function(res){

            console.log(res, 'response');


            var html = res;
            $('#divResults').html(html);
            //window.location.reload();


            return false;
        },
        error:function(xhr, status, error){

            console.log(error);
            console.log(xhr.responseText);
            var err = '';
            $.each(JSON.parse(xhr.responseText) , function(i, item) {

                err +='<li>'+item.msg+'</li>';
            });
            $(".err-area").html(err);
            return false;
        }

    });
}

function registerNewUser() {
    var seller;
    var license;

    var form = {
        first_name: '',
        last_name:'',
        phone: '',
        email: '',
        password: '',
        seller: '',
        license: ''
    };


    if($('#seller').is(":checked"))
    {
        seller = 1;
        license = $('#license').val();
    }
    else
    {
        seller = 0;
        license = "NULL";

    }

    form.first_name =  $('#fname').val();
    form.last_name = $('#lname').val();
    form.phone = $('#phone').val();
    form.email = $('#email').val();
    form.password = $('#password').val();
    form.seller = seller;
    form.license = license;
    //
    // form = {
    //     first_name: $('#fname').val(),
    //     last_name: $('#lname').val(),
    //     phone: $('#phone').val(),
    //     email: $('#email').val(),
    //     password: $('#password').val(),
    //     seller: seller,
    //     license: license
    // };

    $.ajax({
        url:"/fa17g12/api/signup",
        // url:"/api/signup",
        type:"POST",
        data: form,
        success:function(res){

            //window.location.reload();
            window.location.href = '/fa17g12/';
            // window.location.href = '/';
            //window.location.reload;
            //clearFields();
            return false;
        },
        error:function(xhr, status, error){

            console.log(xhr.responseText);
            var err = '';
            $.each(JSON.parse(xhr.responseText) , function(i, item) {

                err +='<li>'+item.msg+'</li>';
            });
            $(".err-area").html(err);
            return false;
        }

    });
};


function searchUserEnter(){
	$('#userSearch').keydown(function(e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			$('#userSearchBtn').click();
		}
	})
}

function userLogin(){
    $.ajax({
        url: "/fa17g12/api/login",
        // url: "/api/login",
        type: "POST",
        data: $("#user_login").serialize(),

        success: function (res) {

            console.log(res, 'res123');
            //window.location.reload();
            window.location.href = '/fa17g12/';
            // window.location.href = '/';
            //window.location.reload;
            //clearFields();
            return false;
        },
        error: function (xhr, status, error) {

            console.log(xhr.responseText);
            var err = '';
            $.each(JSON.parse(xhr.responseText), function (i, item) {

                err += '<li>' + item.msg + '</li>';
            });
            $(".err-area").html(err);
            return false;
        }
    })

};

function messageSeller(user_id) {
	
    var form = {
        name: '',
        phone: '',
        email: '',
		message: ''
    };

    form.name =  $('#buyerName').val();
    form.phone = $('#buyerPhone').val();
    form.email = $('#buyerEmail').val();
	form.message = $('#buyerMessage').val();

    $.ajax({
        url:"/fa17g12/api/message_seller/" + user_id,
        // url:"/api/message_seller/" + user_id,
        type:"POST",
        data: form,
        success:function(res){
			document.getElementById("message-form").reset();
			alert("Message was sent!");
        },
        error:function(xhr, status, error){

            console.log(xhr.responseText);
            var err = '';
            $.each(JSON.parse(xhr.responseText) , function(i, item) {

                err +='<li>'+item.msg+'</li>';
            });
            $(".err-area").html(err);
            return false;
        }
    });
};

function messageSellerEnter(e){
	e = e || window.event;
	if (e.keyCode === 13) {
		// e.preventDefault();
		$("#message-button").click();
		return false;
	}
	else {
		return true;
	}
}

function deleteMessage(message_id){
	$.ajax({
        url:"/fa17g12/api/delete_message/" + message_id,
        // url:"/api/delete_message/" + message_id,
        type: 'DELETE',
        success: function(res) {

            window.location.reload();
            return false;
        },
        error:function(xhr, status, error){

            console.log(xhr.responseText);
            alert("Error deleting");
            return false;
        }
    });
}
