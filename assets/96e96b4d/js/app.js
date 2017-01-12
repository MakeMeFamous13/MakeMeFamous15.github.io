var $body = $('body');
var $item = $('.why-one-to-slim__wrapper-item'),
    $textWrap = $('.why-one-two-slim__wrapper-fore-text'),
    $menuToggle = $('.menu-toggle'),
    $termsOfUse = $('.billing__content--form-checkbox--terms-of-use');

var iter = 0;

function fadeToggleText(e) {
    var arrayClasses = ['heart', 'sun', 'thumbs', 'spinner'];

    if (e) { // if event occured
        for (var i = 0; i < arrayClasses.length; i++) {

            var current = $(e.currentTarget);

            if (current.hasClass(arrayClasses[i])) {
                $textWrap.find('.' + arrayClasses[i] + '__text').fadeIn('slow');
                $item.removeClass('active');
                current.addClass('active');
            } else {
                $textWrap.find('.' + arrayClasses[i] + '__text').fadeOut().stop(false, true);
            }
        }

    } else {
        //doSetTimeout(arrayClasses);
    }

}

function doSetTimeout(arrayClasses) {

    if (iter != arrayClasses.length) {
        setTimeout(function () {
            if ($($item[iter]).hasClass(arrayClasses[iter])) {
                $textWrap.find('.' + arrayClasses[iter] + '__text').fadeIn('slow');
                $item.removeClass('active');
                $($item[iter]).addClass('active');
            } else {
                $textWrap.find('.' + arrayClasses[iter] + '__text').fadeOut().stop(false, true);
            }
        }, 2000);
        iter++;
        return doSetTimeout(arrayClasses, iter);
    } else {
        iter = 0;
        return doSetTimeout(arrayClasses, iter);
    }
}

function toggleMenu(e) {
    var current = $(e.currentTarget);

    if (current.closest('ul').length) {
        var menu = current.closest('ul');
    } else if (current.siblings('ul').length) {
        var menu = current.siblings('ul');
    }

    menu.fadeToggle();

}

function deleteAnimateClassesForIPadAndLess () {
    var IPadWidth = 1024;
    if ($(window).width() <= IPadWidth) {
        $('*').removeClass('wow');
        $('*').removeClass('animated');
        $('.header__nav > nav > ul').addClass('animated');
    }
}

function checkTermsOfUsePerusal () {
    var current = $(this);

    current.closest($termsOfUse).find('span > a').toggleClass('disabled').toggleClass('allow');
    checkTermsOfUseForButton();
}

function checkTermsOfUseForButton () {
    var $goToPayment = $('#go-to-payment > button');
    var termsOfUse = $('#terms-of-use');
    var isChecked = termsOfUse.prop('checked');
    $goToPayment.prop('disabled', false);
    isChecked
        ?
        $goToPayment.prop('disabled', false).addClass('btn-allow').removeClass('btn-disable')
        :
        $goToPayment.prop('disabled', true).addClass('btn-disable').removeClass('btn-allow');
}

$(document).ready(function () {
    orderCreate();

    $("#slides").slidesjs({
        adaptiveHeight: true,
        effect: {
            slide: {
                speed: 1000
            },
            fade: {
                speed: 1000,
                crossfade: true
            }
        },
        play: {
            active: false,
            effect: 'fade'
        },
        navigation: {
            active: false,
            effect: "fade"
        },
        pagination: false
    });

    var idEvent = setInterval(fadeToggleText, 2000);
    $item.on('mouseover', function (event) {
        fadeToggleText(event);
        clearInterval(idEvent);

    });

    $item.on('mouseleave', function () {
        idEvent = setInterval(fadeToggleText, 2000);
    });

    $menuToggle.on('click', function (event) {
        event.preventDefault();
        toggleMenu(event);
    });

    var cartAmount = $('.cart-amount');

    cartAmount.on('click', '.increment-prod-amount', function (e) {
        e.preventDefault();
        var amountInput = $(this).parent('.cart-amount').children('.prod_amount');
        var price = $(this).parent('.cart-amount').children('.prod_price').val();

        var amount = amountInput.val();
        amountInput.val(++amount);
        changeTotalPrice(price, amount);
    });

    cartAmount.on('click', '.decrement-prod-amount', function (e) {
        e.preventDefault();

        var amountInput = $(this).parent('.cart-amount').children('.prod_amount');
        var price = $(this).parent('.cart-amount').children('.prod_price').val();

        var amount = amountInput.val();

        if (amount > 1) {
            amountInput.val(--amount);
            changeTotalPrice(price, amount);
        }
    });

    cartAmount.on('change', '.prod_amount', function (e) {
        e.preventDefault();

        var amountInput = $(this).parent('.cart-amount').children('.prod_amount');
        var price = $(this).parent('.cart-amount').children('.prod_price').val();

        var amount = amountInput.val();

        if (amount <= 0) {
            amount = 1;
            amountInput.val(amount);
        }
        changeTotalPrice(price, amount);
    });

    $('.billing__content').on('change', 'input[type=radio]', function (e) {
        var shippingForm = $('.shipping-form');

        if ($(this).val() == 1) {
            if (!shippingForm.hasClass()) {
                shippingForm.addClass('hidden');
            }
        } else {
            shippingForm.removeClass('hidden');
        }
    });

    $('#subscribe').on('click', function (e) {
        e.preventDefault();
        $('#subscribe__form').submit();
    });

    deleteAnimateClassesForIPadAndLess();
    checkTermsOfUseForButton();

    $termsOfUse.on('change', 'input', checkTermsOfUsePerusal);

    $('#buy-now').on('click', function () {
        $.ajax({
            url: "ajax/update-product-view-counter",
            dataType: "json",
            method: 'get'
        }).done(function(data) {
            $('.modal-body__content-rating #total-reviews').text(data);
        });
    });

    $('#apply__coupon').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var couponCode = $('#coupon__code').val();
        var discountInput = $('#billing__coupon--discount-input');

        $.ajax({
            url: "/ajax/apply-coupon",
            dataType: "json",
            method: 'post',
            data: {couponCode: couponCode}
        }).done(function(data) {
            discountInput.val(data.discount);
            $('.billing__coupon .help-block').text(data.message);
            calculatePrice();
        });
    });

    $('.payment-systems a[data-toggle="tab"]').click(function (e) {
        $('#billingform-paymentsystem').val($(this).data('payment'));
    });

    $('.header__lang > ul').mouseenter(function (e) {
        e.stopPropagation();
        $('.langs__list').fadeIn();
    }).mouseleave(function (e) {
        e.stopPropagation();
        $('.langs__list').fadeOut();
    });

    if ($.cookie) {
        $('.header__lang .langs__list > li > a').on('click', function (e) {
            $.cookie('language', $(this).data('value'), {expires: 10, path: '/'});
        });
    }
});

function orderCreate() {
    $('#billing-create-form').one('click', '.cart-submit button', function (e) {
        var current = $(e.currentTarget);
        e.preventDefault();
        var form = $('#billing-create-form');
        var paymentSystem = $('#billing-create-form #billingform-paymentsystem').val();
        form.data('yiiActiveForm').submitting = true;
        form.yiiActiveForm('validate');
        form.on('beforeSubmit', function (e) {
            $.ajax({
                url: "/billing/create",
                dataType: "json",
                method: 'post',
                beforeSend: function () {
                    var message = translator.t('GO TO PAYMENT');
                    if (paymentSystem == 1) {
                        message = translator.t('Redirecting to PayPal');
                    } else if (paymentSystem == 2) {
                        message = translator.t('Redirecting to AuthorizeNet');
                    } else if (paymentSystem == 3) {
                        message = translator.t('Redirecting to BitPay');
                    }
                    current.html('<i class="fa fa-spinner fa-pulse fa-lg fa-fw margin-bottom"></i> ' + message);
                    current.prop('disabled', true).addClass('btn-disable').removeClass('btn-allow');
                    form.ajaxLoader();
                },
                data: $('#billing-create-form').serialize()
            }).done(function (data) {
                if (data.status) {
                    if (data.paymentSystem == 1 || data.paymentSystem == 3) {
                        window.location.href = data.data;
                    } else if (data.paymentSystem == 2) {
                        $('#confirm-form').html(data.data);
                        $('#authorize-net-form').submit();
                    }
                } else {
                    if (data.message) {
                        current.html(translator.t('GO TO PAYMENT'));
                        current.prop('disabled', false).addClass('btn-allow').removeClass('btn-disable');
                        form.ajaxLoaderRemove();
                        orderCreate();
                        alert(data.message);
                    }
                }
            }).error(function () {
                current.html(translator.t('GO TO PAYMENT'));
                current.prop('disabled', false).addClass('btn-allow').removeClass('btn-disable');
                form.ajaxLoaderRemove();
                orderCreate();
            });

            return false;
        });
    });
}

function changeTotalPrice(price, amount) {
    var totalPriceInput = $('#billing__total--price-input');
    var totalPrice = (price * amount).toFixed(2);

    totalPriceInput.val(totalPrice);
    calculatePrice();
}

function calculatePrice() {
    var totalPriceInput = $('#billing__total--price-input');
    var discountInput = $('#billing__coupon--discount-input');
    var discount = discountInput.val();
    var totalPrice = totalPriceInput.val();
    var price = parseFloat(totalPrice);

    if (discount != 0) {
        price = totalPrice - totalPrice * discount / 100;
    }

    $('.billing__total--price').text((price).toFixed(2));
}