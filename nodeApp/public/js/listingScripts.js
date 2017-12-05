function clearFields() {
    $('#address').val('');
    $('#city').val('');
    $('#state').val('');
    $('#zip_code').val('');
    $('input[type=file]').val('');


}
function saveListing(){

    var formData = new FormData();

    formData.append('address', $('#address').val());
    formData.append('city', $('#city').val());
    formData.append('state', $('#state').val());
    formData.append('zip_code', $('#zip_code').val());
    formData.append('photo', $('input[type=file]')[0].files[0]);


    //console.log(formData, 'FORM');
    $.ajax({

        url:"/fa17g12/api/add_listing",
        // url:"/api/add_listing",
        type:"POST",
        data: formData,
        contentType: false,
        processData: false,
        success:function(res){

            window.location.href = '/fa17g12/api/listings';
            // window.location.href = '/api/listings';
            //window.location.reload;
            clearFields();
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
        // url:"/api/listings/" + listing_id,
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

    var formData = new FormData();

    formData.append('address', $('#address').val());
    formData.append('city', $('#city').val());
    formData.append('state', $('#state').val());
    formData.append('zip_code', $('#zip_code').val());
    formData.append('photo', $('input[type=file]')[0].files[0]);

    console.log(listing_id, 'arg');
    $.ajax({
        url: "/fa17g12/api/listings/" + listing_id,
        // url: "/api/listings/" + listing_id,
        type: "put",
        // data: $("#the-form").serialize(),
        data: formData,
        contentType: false,
        processData: false,
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

        url:"/fa17g12/search_listings/" + listing,
        // url:"search_listings/" + listing,
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

function searchListingEnter(){
    $('#listingSearch').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#listingSearchBtn').click();
        }
    })
}

function listingDescription(listing_id) {

    console.log(listing_id, 'arg');
    $.ajax({
        url: "/fa17g12/api/listing_description/" + listing_id,
        // url: "/api/listing_description/" + listing_id,
        type: "get",
        success: function (res) {
            window.location.href = '/fa17g12/api/listing_description/' + listing_id;
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

function initMap(address) {
    //Center of map is defaulted to SF
    var latLng = new google.maps.LatLng(37.774, -122.431);
    var mapOptions = {
        zoom: 10,
        center: latLng
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Geocoder uses address to find latitude/longitude coordinates
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {

            //Sets the center of map to the location and creates a marker
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map
            });

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
