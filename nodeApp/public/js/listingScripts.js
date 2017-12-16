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
    formData.append('price', $('#price').val());
    formData.append('beds', $('#beds').val());
    formData.append('bath', $('#bath').val());
    formData.append('area', $('#area').val());
    formData.append('description', $('#description').val());
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

function UploadMulPics(listing_id, y)
{
    var formData = new FormData();
    // console.log(listing_id, "Listing ID");
    var fileLength =  $('input[type=file]')[y].files.length;
    // console.log(fileLength, "File Length");
    for (var i = 0; i< fileLength; i++)
    {
        formData.append("photos",$('input[type=file]')[y].files[i]);
        console.log($('input[type=file]')[y].files[i], "File name");

    }
    $.ajax({
        url: "/fa17g12/api/listings/" + listing_id,
        // url: "/api/listings/" + listing_id,
        type: "post",
        // data: $("#the-form").serialize(),
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            // console.log(res, "RESPONSE");
            //window.location.href = '/api/listings';
            // console.log(res);
            var err = '';
            $.each(res, function (i, item) {

            err += '<li>' + item.msg + '</li>';
            });
            $(".success-area").html(err);

            $('input[type=file]').val('');
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

	//this checks for empty search
	if (listing){
		
		console.log(listing);
		sessionStorage.searchString = listing;
	
		$.ajax({

			url:"/fa17g12/search_listings/" + listing,
			// url:"search_listings/" + listing,
			type:"post",
			data:$("#search_form").serialize(),
			success:function(res){

				console.log(res, 'response');


				// var html = res;
				// $('#divResults').html(html);
				//window.location.reload();
				window.location.href = "/fa17g12/search_listings/" + listing;

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
	else{
		error = "Please enter a query.";
        document.getElementById("err-area").innerHTML = error;
		console.log('something');
		return false;
	}
}

function searchListingEnter(e){
		e = e || window.event;
		if (e.keyCode === 13) {
			// e.preventDefault();
			$("#listingSearchBtn").click();
			return false;
		}
		else {
			return true;
		}
}

function listingDescription(listing_id) {

	sessionStorage.returnString = $('#listingSearch').val();

    console.log(listing_id, 'arg');
    $.ajax({
        url: "/fa17g12/api/listing_description/" + listing_id,
        // url: "/api/listing_description/" + listing_id,
        type: "get",
        success: function (res) {
            window.location.href = '/fa17g12/api/listing_description/' + listing_id;
            // window.location.href = '/api/listing_description/' + listing_id;
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

function getSearchString() {
	
	var search = sessionStorage.searchString;
	var backToSearchWord = sessionStorage.returnString;
	
	if (search != "" && search != null){
		
			document.getElementById("listingSearch").value = search;
			sessionStorage.removeItem("searchString");
	}
	else if (backToSearchWord != "" && backToSearchWord != null){
		
		if(sessionStorage.clicked == "1"){
			document.getElementById("listingSearch").value = backToSearchWord;
			sessionStorage.removeItem("returnString");
			sessionStorage.removeItem("clicked");
		}
		else{
			sessionStorage.removeItem("returnString");
			sessionStorage.removeItem("clicked");
		}
	}
	else{
		return false;
	}
	
}

function backToSearch(){
	
	if (sessionStorage.returnString == ""){
		return false;
	}
	
	var requery = sessionStorage.returnString;
	sessionStorage.clicked = "1";
	
    console.log(requery, 'arg');
    $.ajax({
        type: "get",
        success: function (res) {

            // window.location.href = '/returnSearch/' + requery;
            if(typeof requery !== 'undefined'){
                window.location.href = '/fa17g12/returnSearch/' + requery;
                return false;
            }
            else{
                window.location.href = '/fa17g12/';
                return false;
            }
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
