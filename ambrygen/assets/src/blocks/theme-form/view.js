document.addEventListener( 'DOMContentLoaded', () => {
 const formatPhoneNumber = ( value ) => {
  const digits = value.replace( /\D/g, '' ).slice( 0, 10 );

  if ( ! digits ) {
   return '';
  }

  if ( digits.length < 4 ) {
   return `(${ digits }`;
  }

  if ( digits.length < 7 ) {
   return `(${ digits.slice( 0, 3 ) }) ${ digits.slice( 3 ) }`;
  }

  return `(${ digits.slice( 0, 3 ) }) ${ digits.slice( 3, 6 ) }-${ digits.slice( 6 ) }`;
 };

 const getErrorKey = ( field ) => {
  if ( field.type === 'radio' && field.name ) {
   return field.name.replace( /[^a-z0-9_-]/gi, '_' );
  }

  return ( field.id || field.name || 'field' ).replace(
   /[^a-z0-9_-]/gi,
   '_'
  );
 };

 const ensureMessageEl = ( field, messageId ) => {
  const fieldWrapper =
   field.type === 'radio'
    ? field.closest( '.form-line' )
    : field.closest( '.form-input' );

  if ( ! fieldWrapper ) {
   return null;
  }

  let messageEl = fieldWrapper.querySelector( `#${ messageId }` );

  if ( messageEl ) {
   return messageEl;
  }

  messageEl = document.createElement( 'div' );
  messageEl.className = 'form-error-message';
  messageEl.id = messageId;
  messageEl.setAttribute( 'role', 'alert' );
  fieldWrapper.appendChild( messageEl );

  return messageEl;
 };

 const setFieldError = ( field, message ) => {
  const lineEl = field.closest( '.form-line' );
  const messageId = `error-message_${ getErrorKey( field ) }`;
  const messageEl = ensureMessageEl( field, messageId );

  lineEl?.classList.add( 'form-line-error' );
  field.classList.add( 'form-validation-error' );
  field.setAttribute( 'aria-describedby', messageId );

  if ( messageEl ) {
   messageEl.textContent = message;
  }
 };

 const clearFieldError = ( field ) => {
  const lineEl = field.closest( '.form-line' );
  const messageId = `error-message_${ getErrorKey( field ) }`;
  const messageContainer =
   field.type === 'radio'
    ? field.closest( '.form-line' )
    : field.closest( '.form-input' );
  const messageEl = messageContainer?.querySelector( `#${ messageId }` );

 lineEl?.classList.remove( 'form-line-error' );
 field.classList.remove( 'form-validation-error' );
 field.removeAttribute( 'aria-describedby' );

 if ( messageEl ) {
   messageEl.remove();
  }
 };

 document
  .querySelectorAll( '.theme-form-block .jotform-form' )
  .forEach( ( form ) => {
   const phoneInput = form.querySelector( '#input_8_full' );

   if ( phoneInput ) {
    phoneInput.addEventListener( 'input', ( event ) => {
     event.target.value = formatPhoneNumber( event.target.value );
    } );
   }

   form.querySelectorAll( 'input, textarea, select' ).forEach( ( field ) => {
    field.addEventListener( 'input', () => clearFieldError( field ) );
    field.addEventListener( 'change', () => clearFieldError( field ) );
   } );

   form.addEventListener( 'submit', ( event ) => {
    let errorCount = 0;
    const requiredFields = form.querySelectorAll(
     'input[required], textarea[required], select[required]'
    );
    const checkedRadioGroups = new Set();

    requiredFields.forEach( ( field ) => {
     if ( field.type === 'radio' ) {
      if ( checkedRadioGroups.has( field.name ) ) {
       return;
      }

      checkedRadioGroups.add( field.name );
      const group = form.querySelectorAll(
       `input[type="radio"][name="${ field.name }"]`
      );
      const isChecked = Array.from( group ).some(
       ( radio ) => radio.checked
      );

      group.forEach( ( radio ) => clearFieldError( radio ) );

      if ( ! isChecked ) {
       errorCount++;
       group.forEach( ( radio ) =>
        setFieldError( radio, 'This field is required.' )
       );
      }

      return;
     }

     clearFieldError( field );

     if ( ! field.value.trim() ) {
      errorCount++;
      setFieldError( field, 'This field is required.' );
      return;
     }

     if (
      field.type === 'email' &&
      ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( field.value.trim() )
     ) {
      errorCount++;
      setFieldError( field, 'Enter a valid e-mail address' );
      return;
     }

     if (
      field.id === 'input_8_full' &&
      field.value.trim().length < 14
     ) {
      errorCount++;
      setFieldError(
       field,
       'Please enter a valid phone number.'
      );
     }
    } );

    if ( errorCount ) {
     event.preventDefault();
     const firstErrorField = form.querySelector(
      '.form-validation-error'
     );
     firstErrorField?.focus();
    }
   } );
  } );
} );
 
