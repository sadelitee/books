// Language

$('#form-language .dropdown-item').on('click', function (e) {
	e.preventDefault();

	$('#form-language input[name="code"]').val($(this).attr('name'));

	$('#form-language').submit();
});

// Language

// Theme

const icon = $('#theme-icon');

function toggleTheme() {
	const isDark = $('html').toggleClass('dark').hasClass('dark');
	icon.attr('href', isDark ? '/assets/icons/sprite.svg#icon-moon' : '/assets/icons/sprite.svg#icon-sun');
	document.cookie = 'theme=' + (isDark ? 'dark' : '') + '; path=/; max-age=31536000; samesite=Lax';
}

// Theme
function isTouchDevice() {
	return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

// Dropdown

function isTouchDevice() {
	return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

let dropdownCloseTimer = null;

function openDropdown($dropdown) {
	const $menu = $dropdown.find('.dropdown-menu');

	clearTimeout(dropdownCloseTimer);

	$('.dropdown-menu').not($menu).removeClass('show');
	$menu.addClass('show');
}

function closeDropdown($dropdown) {
	const $menu = $dropdown.find('.dropdown-menu');

	dropdownCloseTimer = setTimeout(function () {
		$menu.removeClass('show');
	}, 150);
}

$(document).on('click', '[data-dropdown-button]', function (e) {
	const $dropdown = $(this).closest('.dropdown');
	const $menu = $dropdown.find('.dropdown-menu');
	const type = $dropdown.data('type');

	if (type === 'hover' && !isTouchDevice()) {
		return;
	}

	e.stopPropagation();

	$('.dropdown-menu').not($menu).removeClass('show');
	$menu.toggleClass('show');
});

$(document).on('mouseenter', '.dropdown[data-type="hover"]', function () {
	if (isTouchDevice()) return;

	openDropdown($(this));
});

$(document).on('mouseleave', '.dropdown[data-type="hover"]', function () {
	if (isTouchDevice()) return;

	closeDropdown($(this));
});

$(document).on('mouseenter', '.dropdown-menu', function () {
	clearTimeout(dropdownCloseTimer);
});

$(document).on('click', function () {
	$('.dropdown-menu').removeClass('show');
});

$(document).on('click', '.dropdown-menu', function (e) {
	e.stopPropagation();
});

// Dropdown

// collapsible

document.querySelectorAll('[data-collapsible]').forEach((wrapper) => {
	const content = wrapper.querySelector('[data-collapsible-content]');
	const btn = wrapper.querySelector('.collapse-toggle');

	if (!content || !btn) return;

	const collapsedHeight = 80;
	let expanded = false;

	// фиксируем начальное состояние
	content.style.maxHeight = collapsedHeight + 'px';

	// показываем кнопку только если есть переполнение
	const isOverflowing = content.scrollHeight > collapsedHeight;

	if (!isOverflowing) {
		btn.style.display = 'none';
		return;
	}

	btn.addEventListener('click', () => {
		expanded = !expanded;

		if (expanded) {
			content.style.maxHeight = content.scrollHeight + 'px';
			btn.textContent = 'Згорнути';
		} else {
			content.style.maxHeight = collapsedHeight + 'px';
			btn.textContent = 'Показати більше';
		}
	});
});
// collapsible

// Utils

function debounce(func, wait) {
	let timeout;
	return function () {
		const context = this,
			args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

// Utils

// Cart

const cartButton = $('#cart-button');
const cartBadge = $('.cart-badge');
const cartModal = $('#cart-modal');
const cartProducts = $('#cart-modal-products');
const cartTotals = $('#cart-modal-totals');
const cartOverlay = $('#cart-overlay');
let cartToastTimeout = null;

function openCart() {
	cartModal.addClass('open');
	cartOverlay.removeClass('hidden');
	$('#viewport').addClass('disable-scroll');

	$.ajax({
		url: 'index.php?route=common/cart/info',
		cache: false,
		beforeSend: function () {
			cartProducts.html(`
          <div class="space-y-2">
              <div class="skeleton h-25 w-full rounded-md"></div>
              <div class="skeleton h-25 w-full rounded-md"></div>
              <div class="skeleton h-25 w-full rounded-md"></div>
              <div class="skeleton h-25 w-full rounded-md"></div>
          </div>
        `);
			cartTotals.html(`
            <div class="space-y-2">
                <div class="skeleton h-25 w-full rounded-md"></div>
            </div>
        `);
		},
		success: function (html) {
			const response = $(html);
			cartTotals.html(response.filter('#cart-modal-totals').html());
			cartProducts.html(response.filter('#cart-modal-products').html());
		},
	});
}

function closeCart() {
	cartModal.removeClass('open');
	cartOverlay.addClass('hidden');
	$('#viewport').removeClass('disable-scroll');
}

function addToCart(product_id, quantity = 1, button) {
	$.ajax({
		url: 'index.php?route=common/cart/add',
		type: 'post',
		data: 'product_id=' + product_id + '&quantity=' + quantity,
		dataType: 'json',
		cache: false,
		beforeSend: function () {
			// button.setAttribute('disabled', true);
		},
		success: function (json) {
			cartBadge.text(json['total']);
			// button.innerHTML = button.getAttribute('data-added-text');
			if (json['error']) {
				button.setAttribute('disabled', false);
				return;
			}

			// $('#cart-toast').html(json['totalPrice']);
			// $('#cart-toast').addClass('show');

			if (cartToastTimeout) clearTimeout(cartToastTimeout);
			cartToastTimeout = setTimeout(function () {
				$('#cart-toast').removeClass('show');
				cartToastTimeout = null;
			}, 2500);
			sendToast({ message: json['success'], type: 'success', align: 'right-bottom', timeout: 4000 });
		},
	});
}

// modal

let activeModal = null;

function openModal(selector) {
	activeModal = $(selector);

	activeModal.addClass('open');
	$('[data-modal-overlay]').addClass('open');
	$('#viewport').addClass('disable-scroll');
}

function closeModal() {
	if (!activeModal) return;

	activeModal.removeClass('open');
	$('[data-modal-overlay]').removeClass('open');
	$('#viewport').removeClass('disable-scroll');

	activeModal = null;
}

$(document).on('click', '[data-modal-open]', function () {
	openModal($(this).data('modal-open'));
});

$(document).on('click', '[data-modal-close], [data-modal-overlay]', function () {
	closeModal();
});

$(document).on('keydown', function (e) {
	if (e.key === 'Escape') {
		closeModal();
	}
});

// modal

// toast

function sendToast({ message = 'Success!', type = 'success', align = 'right-top', timeout = 2500 }) {
	const toast = document.getElementById('toast');
	const icon = document.getElementById('toast-icon');
	const msg = toast.querySelector('.toast-message');

	const icons = {
		success: '/assets/icons/sprite.svg#lucide-badge-check',
		error: '#icon-x',
		warning: '#icon-alert-triangle',
	};

	toast.setAttribute('data-type', type);
	toast.setAttribute('data-align', align);
	msg.textContent = message;
	icon.setAttribute('href', icons[type] || icons.success);

	toast.classList.remove('hidden', 'animate-out');
	toast.classList.add('show', 'animate-in');

	clearTimeout(toast._timeout);
	toast._timeout = setTimeout(() => {
		toast.classList.remove('animate-in');
		toast.classList.add('animate-out');

		setTimeout(() => {
			toast.classList.remove('show');
			toast.classList.add('hidden');
		}, 200);
	}, timeout);
}

function closeToast() {
	const toast = document.getElementById('toast');
	toast.classList.remove('animate-in');
	toast.classList.add('animate-out');

	setTimeout(() => {
		toast.classList.remove('show');
		toast.classList.add('hidden');
	}, 200);
}

// toast

function removeCartProduct(productKey) {
	$.ajax({
		url: `index.php?route=common/cart/remove`,
		type: 'post',
		data: `key=${productKey}`,
		cache: false,
		beforeSend: function () {
			cartProducts.html(`
            <div class="space-y-2">
                <div class="skeleton h-25 w-full rounded-md"></div>
                <div class="skeleton h-25 w-full rounded-md"></div>
                <div class="skeleton h-25 w-full rounded-md"></div>
                <div class="skeleton h-25 w-full rounded-md"></div>
            </div>
          `);
			cartTotals.html(`
              <div class="space-y-2">
                  <div class="skeleton h-25 w-full rounded-md"></div>
              </div>
          `);
		},
		success: function (json) {
			const response = $(json['html']);
			cartBadge.text(json['total']);
			cartTotals.html(response.filter('#cart-modal-totals').html());
			cartProducts.html(response.filter('#cart-modal-products').html());
		},
	});
}

function addCartProduct(target) {
	$.ajax({
		url: `index.php?route=common/cart&add=${target}&quantity=1`,
		type: 'get',
		dataType: 'html',
		cache: false,
		beforeSend: function () {
			$('#cart-products').html(`
      <div class="space-y-2">
        <div class="skeleton h-25 w-full rounded-md"></div>
        <div class="skeleton h-25 w-full rounded-md"></div>
        <div class="skeleton h-25 w-full rounded-md"></div>
        <div class="skeleton h-25 w-full rounded-md"></div>
      </div>
    `);
		},
		success: function (data) {
			data = `<div>${data}</div>`;
			$('#cart-products').children().remove();
			$('#cart-products').append($(data).find('#cart-products').html());
			$('#cart-total').html($(data).find('#cart-total').children());
		},
	});
}

function updateCartProduct(target) {
	const product_id = $(target).parent().children('input[name=product_id]').val();
	const quantity = $(target).parent().children('input[name=quantity]').val();

	if (isNaN(quantity)) {
		$(target).parent().children('input[name=quantity]').val(1);
		return;
	}

	$.ajax({
		url: `index.php?route=common/cart&update=${product_id}&quantity=${quantity}`,
		type: 'get',
		dataType: 'html',
		cache: false,
		beforeSend: function () {
			$('#cart-products').html(`
                <div class="space-y-2">
                    <div class="skeleton h-25 w-full rounded-md"></div>
                    <div class="skeleton h-25 w-full rounded-md"></div>
                    <div class="skeleton h-25 w-full rounded-md"></div>
                    <div class="skeleton h-25 w-full rounded-md"></div>
                </div>
            `);
		},
		success: function (data) {
			data = `<div>${data}</div>`;
			$('#cart-products').children().remove();
			$('#cart-products').append($(data).find('#cart-products').html());
			$('#cart-total').html($(data).find('#cart-total').children());
		},
	});
}

const addCartProductDebounced = debounce(addCartProduct, 500);

const updateCartProductDebounced = debounce(updateCartProduct, 500);

// Cart

// Menu

function openMenu() {
	$('#menu-sheet').toggleClass('open');
	$('#sheet-overlay').toggleClass('hidden');
	$('#viewport').toggleClass('disable-scroll');
}

function closeMenu() {
	$('#menu-sheet').toggleClass('open');
	$('#sheet-overlay').toggleClass('hidden');
	$('#viewport').toggleClass('disable-scroll');
}

// Menu

// // dropdown

// document.querySelectorAll('[data-type="hover"]').forEach(function (wrapper) {
// 	const panel = wrapper.querySelector('[data-panel]');

// 	const open = () => {
// 		panel.classList.remove('opacity-0', 'scale-y-90', 'pointer-events-none');
// 		panel.classList.add('opacity-100', 'scale-y-100');
// 	};

// 	const close = () => {
// 		panel.classList.add('opacity-0', 'scale-y-90', 'pointer-events-none');
// 		panel.classList.remove('opacity-100', 'scale-y-100');
// 	};

// 	// Desktop — hover
// 	wrapper.addEventListener('mouseenter', open);
// 	wrapper.addEventListener('mouseleave', close);

// 	// Mobile — click
// 	wrapper.addEventListener('click', function (e) {
// 		const isOpen = !panel.classList.contains('opacity-0');
// 		isOpen ? close() : open();
// 		e.stopPropagation();
// 	});

// 	// Закрыть при клике мимо
// 	document.addEventListener('click', close);
// });

// search

$('#searchButton').on('click', function () {
	const searchValue = $('#searchInput').val();

	// const langMatch = window.location.pathname.match(/^\/(ua|ru|en)(\/|$)/);

	// const langPrefix = langMatch ? `/${langMatch[1]}/` : '/';

	let url = `search`;

	if (searchValue) url += `?search=${encodeURIComponent(searchValue)}`;

	location.href = url;
});

$('#searchInput').on('keydown', function (e) {
	if (e.key === 'Enter') {
		$('#searchButton').trigger('click');
	}
});

// Collapse Text

$(function () {
	$('.collapse-toggle').on('click', function () {
		const $btn = $(this);
		const $container = $btn.parent();

		const $wrapper = $container.find('.text-collapse-wrapper');
		const $content = $container.find('.text-collapse-content');

		if (!$wrapper.length || !$content.length) return;

		const isExpanded = $wrapper.hasClass('expanded');

		if (isExpanded) {
			$wrapper.removeClass('expanded').css('max-height', '300px');
			$btn.text('Показати повністю');
		} else {
			$wrapper.addClass('expanded').css('max-height', $content.outerHeight(true) + 'px');

			$btn.text('Сховати');
		}
	});
});

// Collapse Text
