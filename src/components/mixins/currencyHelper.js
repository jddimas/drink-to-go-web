export default {
   methods: {
      unMoneyFormat(value){
         if(!value) {return null}
         let str = value.toString();
         let val = str.replace("$", "");
         return this.unCurrencyFormat(val);
      },
      unCurrencyFormat(value) {
         if(!value) return 0;
         let str = value.toString();
         let val = str.replace(",", "");
         val = val.replace(",", "");
         val = val.replace(",", "");
         val = val.replace(",", "");
         val = val.replace(",", "");
         val = val.replace(",", "");
         return parseFloat(val.toString());
      },
      currencyFormat(value, decimales = 2){
         if(!value) return '$ 0.00';
         else return `$ ${parseFloat(value).toFixed(decimales)}`;
       },
   }
 }