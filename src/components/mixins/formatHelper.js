export default {
  methods: {
    format_price(value, decimales = 0) {
      let val = (value / 1).toFixed(decimales).replace(",", ".");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    costFormat(value) {
      if(!value){ return "$0";}
      if(value == "Pendiente") {return value;}
      else {
        return "$" + this.format_price(value, 2);
      }
    },
    costFormatNoCents(value) {
      if(!value){ return "$0";}
      if(value === "Pendiente") {return value;}
      else return "$" + this.format_price(value);
    },
    prcgFormat(value, decimales = 0){
      if(!value){ return "0%";}
      if(value == "Pendiente"){ return value;}
      else{ return value.toFixed(decimales) + "%";}
    },
    decimalsFormat(value, decimales = 0){
      if(!value){ return 0;}
      if(value == "Pendiente"){ return 0;}
      else{ return value.toFixed(decimales);}
    },
    explicitMoneyFormat(value, decimales = 2) {
      if(value == null) return "";
      else {
        return "$" + this.format_price(value, decimales);
      }
    },
    mxnFormat(value){
      if(!value){ return "$0MXN";}
      else {
        return "$" + this.format_price( parseInt(value), 0) + "MXN";
      }
    },
    moneyFormat(value){
      if(!value){ return "$0";}
      else {
        return "$" + this.format_price( parseInt(value), 0);
      }
    },
    decimalPercentFormat(value, decimales = 2){
      if(!value) return "0%";
      else {
        return (value * 100).toFixed(decimales) + "%";
      }
    },
    roundedFormat(value, decimales = 2){
      if(!value){ return 0; }
      else {
        let c = value.toFixed(decimales);
        let cd = Math.round(c);
        return cd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    phoneFormat(value){
      if(!value) return value
      else {
        return '(' + value.substr(0, 2) + ') ' + value.substr(2, 4) + '-' + value.substr(6,4)
      }
    },
    capitalizeFirstLetter(value){
      if(!value) return value
      else {
        const arr = value.split(" ");
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        
        } 

        return arr.join(" ");
      }
    }
  }
}