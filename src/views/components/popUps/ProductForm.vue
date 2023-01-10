<template>
    <section id="product-form">
        <div class="vx-row mb-5">
            <div class="vx-col lg:w-1/2 md:w-1/2 sm:w-full w-full mb-5">
                <label for="" class="vs-input--label">Nombre:</label>
                <vs-input
                    name="name"
                    v-validate="ruleRequired"
                    v-model="currentProduct.nombre"
                    placeholder="Escribe el nombre del producto"
                    :danger="hasError('name')"
                    :danger-text="getErrorText('name')"
                    :success="isSuccessful('name')"
                    class="w-full"/>
            </div>

            <div class="vx-col lg:w-1/2 md:w-1/2 sm:w-full w-full mb-5">
                <label for="" class="vs-input--label">Seleccione una categoría:</label>
                <vs-select
                    v-validate="ruleRequired"
                    class="w-full vs-custom"
                    v-model="currentProduct.idCategoria"
                    name="type"
                    placeholder="Ej, Cervezas"
                    :danger="hasError('type')"
                    :danger-text="getErrorText('type')"
                    :success="isSuccessful('type')">
                    <vs-select-item
                        v-for="(item,index) in ProductCategories"
                        :key="index"
                        :value="item.idCategoria"
                        :text="item.descripcion" />
                </vs-select>
            </div>

            <div class="vx-col lg:w-1/2 md:w-1/2 sm:w-full w-full mb-5">
                <label for="" class="vs-input--label">Precio: $</label>
                <vs-input
                    v-validate="ruleRequired"
                    v-model.number="currentProduct.precio"
                    type="number"
                    name="cost"
                    class="w-full"
                    :danger="hasError('cost')"
                    :danger-text="getErrorText('cost')"
                    :success="isSuccessful('cost')"
                />
            </div>
            
            <div class="vx-col lg:w-1/2 md:w-1/2 sm:w-full w-full mb-5">
                <label for="" class="vs-input--label">Disponibilidad:</label>
                <vs-input
                    v-validate="ruleRequired"
                    v-model.number="currentProduct.inventario"
                    :placeholder="currentProduct.inventario == null ? 'Escribe la disponibilidad del producto. Ej, 1' : ''"
                    class="w-full"
                    type="number"
                    name="stock"
                    :danger="hasError('stock')"
                    :danger-text="getErrorText('stock')"
                    :success="isSuccessful('stock')"/>
            </div>

            <div class="vx-col lg:w-full md:w-full sm:w-full w-full">
                <label for="" class="vs-input--label">Detalle:</label>
                <vs-textarea
                    v-validate="ruleRequired"
                    v-model.lazy="currentProduct.descripcion"
                    placeholder="ej. Bebida refrescante de 355ml con 5% de alcohol"
                    name="description"
                    :danger="hasError('description')"
                    :danger-text="getErrorText('description')"
                    :success="isSuccessful('description')"
                />
            </div>
            <div class="vx-col lg:w-1/2 md:w-1/2 sm:w-full w-full">
                <div class="centerx ml-6">
                    <vs-upload 
                        ref="vsupload"
                        id="productImage"
                        :show-upload-button="false" 
                        :multiple="false" 
                        limit="1"
                        :fileName="currentProduct.nombre + '_logo'"
                        :acceptFileTypes="['png']"
                        text="Foto de producto" 
                        action="https://jsonplaceholder.typicode.com/posts/" 
                    />
                </div>
            </div>
            <div class="vx-col lg:w-full md:w-full sm:w-full w-full">
                <small>**Tamaño mínimo de 420px X 420px, formato  PNG **</small>
                <div class="flex float-right mt-4">
                    <vs-button @click.stop="handleClose()" type="line" color="primary" class="mr-4">Cerrar</vs-button>
                    <vs-button @click.stop="requestSaveProduct()" color="primary">Guardar producto</vs-button>
                </div>
            </div>
        </div>
    </section>
</template>



<script>
import {VMoney} from 'v-money'

const productsType = [
    {value: 1, text: "Cerveza"},
    {value: 2, text: "Tequila"},
];

// {
//   "idProducto": 0,
//   "nombre": "string",
//   "idCategoria": 0,
//   "precio": 0,
//   "costo": 0,
//   "inventario": 0,
//   "descripcion": "string",
//   "fechaRegistro": "2022-06-25T04:07:26.195Z",
//   "fechaActualizacion": "2022-06-25T04:07:26.195Z",
//   "imagen": "string"
// }

export default {
    name: "product-form"
    , directives: {money: VMoney}
    , props: {
        currentProduct: { type: Object, required: true },
        isEditing: { type: Boolean, required: true },
        ProductCategories: { type: Array, required: true }
    },
    data() {
        return {
            ruleRequired: 'required',
            productsType: productsType,
            money: {
                decimal: '.',
                thousands: ',',
                prefix: '$',
                suffix: '',
                precision: 2,
                masked: false
            },
            file: null,
            filex: null
        }
    },
    mounted() {
        this.errors.clear();
        if(this.isEditing) {
            this.setImage();
        }
    },
    methods: {
        setImage() {
            // this.$refs.vsupload.filesx.push(this.dataURLtoFile(this.currentProduct.imagenPequenia, this.currentProduct.nombre));
            const objImg = {
                error:false
                , orientation:"h"
                , percent:null
                , remove:null
                , src: 'https://'+this.currentProduct.imagenGrande
                , type:"image"
            }
            this.$refs.vsupload.srcs.push(objImg);
            this.$refs.vsupload.filesx.push('https://'+this.currentProduct.imagenGrande);
        },
        dataURLtoFile(dataurl, filename) {
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
                
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            
            return new File([u8arr], filename, {type:mime});
        },
        onSetFile(){
            // llamado cuando el archivo es cargado en el componente (no es el envío)
            this.prepFileLoaded = true;
        },
        hasError(f) {
            return this.errors.has(f);
        },
        getErrorText(control) {
            return this.errors.first(control);
        },
        errorText(f) {
            return this.errors.first(f);
        },
        isSuccessful(control) {
            const field = this.fields[control];
            return (field && field.required && field.valid && !this.hasError(control));
        },
        async requestSaveProduct() {

            const validity = await this.$validator.validateAll();
            if(!validity) {
                this.missingFieldsNotif();
                return;
            }

            // console.log(this.$refs.vsupload.srcs);
            if(this.$refs.vsupload.srcs.length > 1) {
                this.file =  this.$refs.vsupload.srcs[this.$refs.vsupload.srcs.length - 1];
            } else {
                this.file =  this.$refs.vsupload.srcs[0];
            }

            if(this.$refs.vsupload.filesx.length > 1){
                this.filex =  this.$refs.vsupload.filesx[this.$refs.vsupload.filesx.length - 1];
            } else {
                this.filex = this.$refs.vsupload.filesx[0];
            }

            if(this.file == null || this.file == undefined){
                this.missingFieldsNotif();
                return;
            }

            let text = `¿Desea ${this.isEditing ? 'editar' : 'agregar'} el producto ${this.currentProduct.nombre}?`
            let title = `${this.isEditing ? 'Editar' : 'Agregar'} nuevo producto'`
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: title,
                text: text,
                acceptText: "Aceptar",
                cancelText: 'Cancelar',
                accept: this.doSaveProduct
            });
            
        },
        async doSaveProduct() {
            try {
                this.showLoading(true);
                const payload = {};
                payload.nombre = this.currentProduct.nombre;
                payload.idCategoria = this.currentProduct.type;
                payload.precio = this.currentProduct.precio;
                payload.costo = this.currentProduct.precio;
                payload.inventario = this.currentProduct.inventario;
                payload.descripcion = this.currentProduct.descripcion;
                payload.idCategoria = this.currentProduct.idCategoria;
                payload.imagen = this.file.src;
                let action = "createProduct";

                if(this.isEditing){
                    payload.idProducto = this.currentProduct.idProducto;
                    action = "updateProduct";
                }
                
                const res = await axios.post(`/api/NegProductos/${action}`, payload);
                if(res.data.code == 200){
                    let idProduct = this.isEditing ? this.currentProduct.idProducto : res.data.data.idProducto;
                    let formData = new FormData();
                    formData.append("file", this.filex);
                    await axios.put(`/api/NegProductos/UpdateProductPhoto/${idProduct}`, formData);
                    this.saveSuccessNotif();
                    this.$emit('on-save');
                } else {
                    this.failedOperationNotif("Ha ocurrido un error.", res.data.message);
                }
                this.showLoading(false);
            } catch (error) {
                console.error(error);
                this.failedOperationNotif("Ha ocurrido un error.");
                this.showLoading(false);
            }
        },
        handleClose() {
            this.$emit('on-close');
        },
    }

}
</script>

<style>
.swal-overlay--show-modal {
    z-index: 90000;
}

</style>