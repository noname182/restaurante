import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animations from '@midudev/tailwind-animations';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                playfair: ['Playfair Display', 'serif'],
                poppins: ['Poppins', 'sans-serif'],
            },

            colors: {

                /* Paleta Jhaseft */
                darkGray: '#231f20',      // Gris oscuro
                grayCustom: '#939191',    // Gris
                turquoise: '#01a387',     // Turquesa vivido
                darkTurquoise: '#165a4e', // Turquesa oscuro

                /* Paleta de diego*/
                verdeProfundo: '#006400',
                doradoSuave: '#C5A059',
                cafeClaro: '#C4A484',
                beige: '#F5F5DC',
                blancoCrema: '#FDFCF0',
            },
        },
    },

    plugins: [
        forms,
        animations,
    ],
};
