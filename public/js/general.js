// var images = [], imagesFile = [];
var image_upload = new FormData();
var selectedStar,
    hotelId;

// $('#add-picture').on('click', function () {
//     var inputVal = $('#hotel-img').val();
//     if(inputVal !== '') {
//         // bx
//         inputVal = inputVal.split("\\")[2];
//         images.push(inputVal);
//         imagesFile.push($('#hotel-img')[0].files[0]);
//         image_upload.append(inputVal, $('#hotel-img')[0].files[0]);
//         // $('#hotel-img').val('');
//
//     }
// });

$('#add-picture').on('click', function ()
{
    var fd = new FormData();
    var image = $('#hotel-img')[0].files[0];
    console.log(image);
    fd.append('file', image);
    fd.append('hotelId', hotelId);
    $.ajax({
        url: "/save-image",
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: fd,
        // cache:false,
        contentType: false,
        processData: false,
        success: function(result){
            let img = document.createElement("IMG");
            img.src = "/images/" + hotelId + '/' + image.name;
            $("#added-images-section")[0].appendChild(img);
        },
        error: function (e) {
            // console.log(e);
        }
    });
});

$('#save-hotel').on('click', function () {
    var hotelName = $('#hotel-name').val(),
        hotelDescription = $('textarea').val(),
        country = $('#country').val(),
        city = $('#city').val(),
        address = $('#address').val();

    $.ajax({
        url: "/save-hotel",
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: {
            name: hotelName,
            description: hotelDescription,
            stars: selectedStar,
            country: country,
            city: city,
            address: address
        },
        success: function(result){
            if(result !== 'error') {
                if(!result.fail) {
                    hotelId = result;
                    $('#add-pictore-section').show();
                    $('#hotel-name-and-description-section').hide();
                    $('#error-section').html('').hide();
                } else {
                    let errors = Object.keys(result.errors).map(function(key) {
                        return [key, result.errors[key][0]];
                    });
                    $('#error-section').html('');
                    for(let i=0; i<errors.length; i++) {
                        $('#error-section').append('<li>' + errors[i][1] + '</li>');
                    }
                }
            }
        },
        error: function (e) {
            // console.log(e);
        }
    });
});

$('.fa-star').on('click', function () {
    var stars = $('.fa-star');
    selectedStar = $(this).index('.fa-star') + 1;

    for(let i=0; i<stars.length; i++) {
        if(i < selectedStar) {
            $(stars[i]).addClass('checked');
        } else {
            $(stars[i]).removeClass('checked');
        }
    }
});
