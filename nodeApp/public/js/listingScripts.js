function saveListing(){

    $.ajax({

        url:"/fa17g12/api/listings",
        type:"post",
        data:$("#the-form").serialize(),
        success:function(res){

            window.location.reload();
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

function deleteListing(listing_id){

    $.ajax({
        url:"/fa17g12/api/listings/" + listing_id,
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

function editListing(listing_id) {

    console.log(listing_id, 'arg');
    $.ajax({
        url: "/fa17g12/api/listings/" + listing_id,
        type: "put",
        data: $("#the-form").serialize(),
        success: function (res) {

            window.location.href = '/fa17g12/api/listings';
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

function searchListing(){
    var listing = $('#listingSearch').val();
    console.log(listing);

    $.ajax({

        url:"/fa17g12/searchListings/" + listing,
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