import moment from 'moment'
export default {
  methods: {
    urlFormat(value) {
      if(value){
        return moment(String(value)).format('YYYY-MM-DD')
      }
    },
    explicitDateFormat(value) {
      if(value){
        return moment(String(value)).format('DD/MM/YYYY [a las] hh:mm a')
      }
    },
    sessionFormat(value) {
      if(value){
        return moment(String(value)).format('DD/MM/YYYY h:mm a')
      }
    },
    regularDateFormat(value) {
      if(value){
        return moment(String(value)).locale("es").format('DD/MM/YYYY')
      }
    },
    midDateFormat(value) {
      if(value){
        return moment(String(value)).locale("es").format('DD [de] MMMM [de] YYYY')
      }
    },
    humanDateFormat(value) {
      if(value){
        return moment(String(value)).locale("es").format('D MMM YYYY')
      }
    },
    dateTimeFormat(value) {
      if(value){
        return moment(String(value)).locale("es").format('DD/MM/YYYY HH:mm')
      }
    },
    dateTime12Format(value) {
      if(value){
        return moment(String(value)).locale("es").format('DD/MM/YYYY h:mm a')
      }
    },
    compactDateFormat(value) {
      if(value){
        return moment(String(value)).locale("es").format('DD [de] MMM [´]YY')
      }
    },
    logDateFormat(value) {
      if(value){
        return moment(String(value)).locale("es").format('DD [de] MMMM [de] YYYY HH:mm')
      }
    },
    timeAgoFormat(value) {
      if(value){
        return moment(String(value)).locale("es").fromNow();
      }
    },
    calculateAgeFromDate(value){
      if(value){
        return moment().diff(value, 'years');
      }
    },
    minDateForValidAge(years){
      return moment().subtract(years, 'years').format();
    },
    calculateDaysDiff(value){
      if(value){
        let m = moment(String(value));
        let n = moment();
        return n.diff(m, 'days');
      }
    },
    validatedDate(value){
      if(value){
        let m = moment(String(value));
        if(m.isValid()){
          return m.locale("es").format('DD/MM/YYYY');
        }
        else {
          return "--";
        }
      }
    },
    getDateFromInputs(yy,mm,dd){
      let yint =  parseInt(yy);
      let mint = parseInt(mm);
      mint -= 1;
      if(yint <= 20){
        // suponer que el año es entre 2000 y 2010
        yint += 2000;
      }
      else {
        // suponer que el año es menor a 2000
        yint += 1900;
      }

      let m = moment({ year: yint, month: mint, day: dd});
      if(m.isValid()){
        return m.format('YYYY-MM-DD');
      }
      else {
        return false;
      }
    },
    nextAccreditationDate(value){
      if(value){
        let m = moment(String(value)).add(180, 'days');
        return m.locale("es").format('DD/MM/YYYY');
      }
      else {
        return "--"
      }
    },
    setDateToEndOfDay(value){
      let m = moment(String(value)).add(1, 'days');
      let d = m.endOf('day')
      let end = d.locale("es").format('YYYY-MM-DD HH:mm:ss');
      return end;
    },
    setDateToStartOfDay(value){
      let m = moment(String(value)).add(1, 'days');
      let d = m.startOf('day');
      let start = d.locale("es").format('YYYY-MM-DD HH:mm:ss');
      return start;
    },
    signatureFormatDate(value){
      if(value){
        let m = moment(String(value));
        if(m.isValid()){
          return m.locale("es").format('DD/MM/YYYY HH:mm:ss');
        }
      }
      return "No establecido";
    },
    signatureValidityDate(value){
      if(value){
        let m = moment(String(value));
        if(m.isValid()){
          return m.locale("es").format('DD/MM/YYYY');
        }
      }
      return "No establecido";
    },
    incomeSpecial(value){
      if(value){
        let m = moment(String(value));
        if(m.isValid()){
          return m.locale("es").format('MMMM - YYYY').toUpperCase();
        }
      }
      return "No establecido";
    },

  }
}