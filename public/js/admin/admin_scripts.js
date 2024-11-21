$(function () {
    var maxField = 2; //Input fields increment limitation
    var addButton = $('.add_button'); //Add button selector
    var wrapper = $('.field_wrapper'); //Input field wrapper
    var fieldHTML = '<div class="mt-2 mb-2 row"><input class="form-control m-1 col-md-3" type="text" name="periode[]" placeholder="Periode" value=""/><input class="form-control m-1 col-md-3" type="number" name="tarif[]" placeholder="tarif" value=""/><input  class="form-control m-1 col-md-3" type="text" id="descriptionForfait" name="descriptionForfait[]" placeholder="Description" required="" /><div class="col-md-2"><div class="container text-center"><div class="row align-items-start"><a href="javascript:void(0);" class="remove_button col-md-1"><i class="fa fa-trash text-danger" style="font-size: 25px;"></i></a></div></div></div></div>'; //New input field html

    var x = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addButton).click(function () {
        //Check maximum number of input fields
        if (x < maxField) {
            x++; //Increment field counter
            $(wrapper).append(fieldHTML); //Add field html
        }
    });

    var add_button_partenaire_mobile = $('.add_button_partenaire_mobile');
    var add_button_partenaire_ussd = $('.add_button_partenaire_ussd');

    //Once add button is clicked
    $(add_button_partenaire_mobile).click(function () {
        const wrapper = $(this).closest('.field_wrapper'); //Find the closest parent field_wrapper
        const fieldHTML = '<div class="mt-2 mb-2 row"><input class="form-control m-1 col-md-4" type="text" name="periodeMobileMoney[]" placeholder="Periode" value=""/><input class="form-control m-1 col-md-4" type="number" name="tarifMobileMoney[]" placeholder="tarif" value=""/><div class="col-md-2"><div class="container text-center"><div class="row align-items-start"><a href="javascript:void(0);" class="remove_button col-md-1"><i class="fa fa-trash text-danger" style="font-size: 25px;"></i></a></div></div></div></div>'; //New input field html
        $(wrapper).append(fieldHTML);
    });

    $(add_button_partenaire_ussd).click(function () {
        const wrapper = $(this).closest('.field_wrapper'); //Find the closest parent field_wrapper
        const fieldHTML = '<div class="mt-2 mb-2 row"><input class="form-control m-1 col-md-4" type="text" name="periodeUssd[]" placeholder="Periode" value=""/><input class="form-control m-1 col-md-4" type="number" name="tarifUssd[]" placeholder="tarif" value=""/><div class="col-md-2"><div class="container text-center"><div class="row align-items-start"><a href="javascript:void(0);" class="remove_button col-md-1"><i class="fa fa-trash text-danger" style="font-size: 25px;"></i></a></div></div></div></div>'; //New input field html
        $(wrapper).append(fieldHTML);
    });
   

    //Once remove button is clicked
    $(wrapper).on('click', '.remove_button', function (e) {
        e.preventDefault();
        $(this).parents('div').eq(3).remove(); //Remove field html
        x--; //Decrement field counter
    });
});

