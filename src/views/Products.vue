<template>
    <section id="products" class="p-4 pt-0">
        <!-- header -->
        <section>
            <h1 class="dg-title mb-4">Productos</h1>
            <h5 class="mb-8">Agrega y edita todos tus Productos</h5>
        </section>

        <!-- content -->
        <section>
            <div class="vx-row">
                <div class="vx-col w-full">
                    <vs-table id="productsTable" ref="productsTable" search pagination :data="products" noDataText="No se encontraron productos" :max-items="25">
                        <template slot="header">
                            <vs-button @click.stop="createProduct()" color="primary">Agregar producto</vs-button>
                        </template>
                        <template slot="thead">
                            <vs-th class="bold" v-for="(col, idx) in columns" v-bind:key="idx" :sort-key="col.sortable ? col.key : null" >{{col.title}}</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].imagenPequenia">
                                    <img :src="tr.imagenPequenia" :alt="tr.name" width="60px" height="60px">
                                </vs-td>
                                <vs-td :data="data[indextr].nombre">
                                    <strong> {{ tr.nombre }}</strong>
                                </vs-td>
                                <vs-td :data="tr.categoria">
                                    {{ tr.categoria }}
                                </vs-td>
                                <vs-td :data="indextr" class="opacity-75">
                                    {{ tr.descripcion }}
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <vs-button @click.stop="editProduct(tr)" type="flat" class="mr-2" icon="edit"></vs-button>
                                        <vs-button @click.stop="requestDeleteProduct(tr)" type="flat" icon="delete"></vs-button>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </div>
        </section>

        <vs-popup :active.sync="productFormPrompt" :title="modalTitle">
            <product-form 
                v-if="productFormPrompt"
                :isEditing="isEditing"
                :currentProduct="currentProduct"
                :ProductCategories="categories"
                @on-save="handleOnSave()"
                @on-close="productFormPrompt = false"
            />
        </vs-popup>
    </section>
</template>

<script>
import ProductForm from "./components/popUps/ProductForm.vue";

    const columns = [
        { title: "FOTO", key: "img", sortable: false }
        , { title: "NOMBRE", key: "name", sortable: true }
        , { title: "CATEGORIA", key: "category", sortable: false }
        , { title: "DETALLES", key: "detail", sortable: false }
        , { title: "", key: "actions", sortable: false }
    ];

export default {
    name: "products",
    components: {
        ProductForm
    },
    data() {
        return {
            columns: columns,
            products: [],
            productFormPrompt: false,
            modalTitle: "Agregar producto",
            currentProduct: {},
            isEditing: false,
            categories: []
        }
    },
    mounted() {
        this.getProducts();
        this.getProductsCategories();
    },
    methods: {
        async getProductsCategories() {
            try {
                this.showLoading(true);
                const res = await axios.get(`/api/CatCategoriaProducto`);
                if(res.data.code == 200){
                    this.categories = res.data.data;
                }
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                console.error(error);
            }
        },
        createProduct(){
            this.modalTitle = "Agregar producto";
            this.currentProduct = {};
            this.isEditing = false;
            this.productFormPrompt = true;
        },
        editProduct(product){
            this.modalTitle = "Editar producto";
            this.currentProduct = product;
            this.isEditing = true;
            this.productFormPrompt = true;
        },
        async getProducts() {
            try {
                this.showLoading(true);
                const res = await axios.get(`/api/NegProductos/getProducts`);
                if(res.data.code == 200){
                    this.products = res.data.data;
                }
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                console.error(error);
            }
        },
        handleOnSave() {
            this.productFormPrompt = false;
            this.getProducts();
        },
        async requestDeleteProduct(product) {
            this.currentProduct = product;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: "Eliminar producto",
                text: `¿Estás seguro de eliminar este producto: ${this.currentProduct.nombre}?`,
                acceptText: "Aceptar",
                cancelText: 'Cancelar',
                accept: this.doDeleteProduct
            });
            
        },
        async doDeleteProduct() {
            try {
                this.showLoading(true);
                const res = await axios.delete(`/api/NegProductos/deleteProduct/${this.currentProduct.idProducto}`);
                if(res.data.code == 200){
                    this.deleteSuccessNotif();
                    this.getProducts();
                } else {
                    this.failedOperationNotif("Ha ocurrido un error.");
                }
                this.showLoading(false);
            } catch (error) {
                console.error(error);
                this.failedOperationNotif("Ha ocurrido un error.");
                this.showLoading(false);
            }
        },
    }

}
</script>

<style scope>
    .vs-icon {
        font-size: 1.5rem !important;
    }
</style>