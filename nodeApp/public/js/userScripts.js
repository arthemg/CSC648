function addNewUser(){

    $.ajax({

        url:"/api/user",
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
        url:"/api/user/"+user_id,
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
        url: "/api/user/" + user_id,
        type: "put",
        data: $("#the-form").serialize(),
        success: function (res) {

            window.location.href = '/api/user';
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

        url:"/search/" + user,
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
