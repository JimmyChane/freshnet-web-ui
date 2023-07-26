import HostApi from "@/host/HostApi";

export default class Product {
  static list(): Promise<any> {
    return HostApi.request().url("productv2/list/").send();
  }
  static addItem(data: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("productv2/")
      .body({ content: data })
      .send();
  }
  static removeItem(id: string): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url(`productv2/id/${id}`)
      .body({ id })
      .send();
  }
  static updateTitle(id: string, title: string): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/title/")
      .body({ content: { productId: id, title } })
      .send();
  }
  static updateDescription(id: string, description: string): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/description/")
      .body({ content: { productId: id, description } })
      .send();
  }
  static updateBrand(id: string, brandId: string): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/brandId/")
      .body({ content: { productId: id, brandId } })
      .send();
  }
  static updateCategory(id: string, categoryId: string): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/categoryId/")
      .body({ content: { productId: id, categoryId } })
      .send();
  }
  static updateAvailability(id: string, isAvailable: boolean): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/isAvailable/")
      .body({ content: { productId: id, isAvailable } })
      .send();
  }
  static updateSecondHand(id: string, isSecondHand: boolean): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/isSecondHand/")
      .body({ content: { productId: id, isSecondHand } })
      .send();
  }
  static updatePrice(id: string, price: any): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/price/")
      .body({ content: { productId: id, price } })
      .send();
  }
  static addBundle(id: string, bundle: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("productv2/bundle/")
      .body({ content: { productId: id, bundle } })
      .send();
  }
  static removeBundle(id: string, bundle: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url("productv2/bundle/")
      .body({ content: { productId: id, bundle: bundle } })
      .send();
  }
  static addGift(id: string, gift: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("productv2/gift/")
      .body({ content: { productId: id, gift } })
      .send();
  }
  static removeGift(id: string, gift: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url("productv2/gift/")
      .body({ content: { productId: id, gift } })
      .send();
  }

  static addSpecification(id: string, specification: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("productv2/specification/")
      .body({ content: { productId: id, specification } })
      .send();
  }
  static removeSpecification(id: string, specification: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url("productv2/specification/")
      .body({ content: { productId: id, specification } })
      .send();
  }
  static updateSpecifications(id: string, specifications: any[]): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("productv2/specification/list")
      .body({ content: { productId: id, specifications } })
      .send();
  }
  static addImage(id: string, imageForm: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`productv2/id/${id}/image/`)
      .bodyObject(imageForm)
      .sendNotJson();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url(`productv2/id/${id}/image/`)
      .body({ content: { image } })
      .send();
  }
}
