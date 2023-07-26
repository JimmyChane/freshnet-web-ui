import HostApi from "@/host/HostApi";
export default class Product {
    static list() {
        return HostApi.request().url("productv2/list/").send();
    }
    static addItem(data) {
        return HostApi.request()
            .POST()
            .url("productv2/")
            .body({ content: data })
            .send();
    }
    static removeItem(id) {
        return HostApi.request()
            .DELETE()
            .url(`productv2/id/${id}`)
            .body({ id })
            .send();
    }
    static updateTitle(id, title) {
        return HostApi.request()
            .PUT()
            .url("productv2/title/")
            .body({ content: { productId: id, title } })
            .send();
    }
    static updateDescription(id, description) {
        return HostApi.request()
            .PUT()
            .url("productv2/description/")
            .body({ content: { productId: id, description } })
            .send();
    }
    static updateBrand(id, brandId) {
        return HostApi.request()
            .PUT()
            .url("productv2/brandId/")
            .body({ content: { productId: id, brandId } })
            .send();
    }
    static updateCategory(id, categoryId) {
        return HostApi.request()
            .PUT()
            .url("productv2/categoryId/")
            .body({ content: { productId: id, categoryId } })
            .send();
    }
    static updateAvailability(id, isAvailable) {
        return HostApi.request()
            .PUT()
            .url("productv2/isAvailable/")
            .body({ content: { productId: id, isAvailable } })
            .send();
    }
    static updateSecondHand(id, isSecondHand) {
        return HostApi.request()
            .PUT()
            .url("productv2/isSecondHand/")
            .body({ content: { productId: id, isSecondHand } })
            .send();
    }
    static updatePrice(id, price) {
        return HostApi.request()
            .PUT()
            .url("productv2/price/")
            .body({ content: { productId: id, price } })
            .send();
    }
    static addBundle(id, bundle) {
        return HostApi.request()
            .POST()
            .url("productv2/bundle/")
            .body({ content: { productId: id, bundle } })
            .send();
    }
    static removeBundle(id, bundle) {
        return HostApi.request()
            .DELETE()
            .url("productv2/bundle/")
            .body({ content: { productId: id, bundle: bundle } })
            .send();
    }
    static addGift(id, gift) {
        return HostApi.request()
            .POST()
            .url("productv2/gift/")
            .body({ content: { productId: id, gift } })
            .send();
    }
    static removeGift(id, gift) {
        return HostApi.request()
            .DELETE()
            .url("productv2/gift/")
            .body({ content: { productId: id, gift } })
            .send();
    }
    static addSpecification(id, specification) {
        return HostApi.request()
            .POST()
            .url("productv2/specification/")
            .body({ content: { productId: id, specification } })
            .send();
    }
    static removeSpecification(id, specification) {
        return HostApi.request()
            .DELETE()
            .url("productv2/specification/")
            .body({ content: { productId: id, specification } })
            .send();
    }
    static updateSpecifications(id, specifications) {
        return HostApi.request()
            .PUT()
            .url("productv2/specification/list")
            .body({ content: { productId: id, specifications } })
            .send();
    }
    static addImage(id, imageForm) {
        return HostApi.request()
            .POST()
            .url(`productv2/id/${id}/image/`)
            .bodyObject(imageForm)
            .sendNotJson();
    }
    static removeImage(id, image) {
        return HostApi.request()
            .DELETE()
            .url(`productv2/id/${id}/image/`)
            .body({ content: { image } })
            .send();
    }
}
