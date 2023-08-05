import Server from "@/host/Server";

export default class Product {
  static list(): Promise<any> {
    return Server.request().path("productv2/list/").sendJson();
  }
  static addItem(data: any): Promise<any> {
    return Server.request()
      .POST()
      .path("productv2/")
      .bodyJson({ content: data })
      .sendJson();
  }
  static removeItem(id: string): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`productv2/id/${id}`)
      .bodyJson({ id })
      .sendJson();
  }
  static updateTitle(id: string, title: string): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/title/")
      .bodyJson({ content: { productId: id, title } })
      .sendJson();
  }
  static updateDescription(id: string, description: string): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/description/")
      .bodyJson({ content: { productId: id, description } })
      .sendJson();
  }
  static updateBrand(id: string, brandId: string): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/brandId/")
      .bodyJson({ content: { productId: id, brandId } })
      .sendJson();
  }
  static updateCategory(id: string, categoryId: string): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/categoryId/")
      .bodyJson({ content: { productId: id, categoryId } })
      .sendJson();
  }
  static updateAvailability(id: string, isAvailable: boolean): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/isAvailable/")
      .bodyJson({ content: { productId: id, isAvailable } })
      .sendJson();
  }
  static updateSecondHand(id: string, isSecondHand: boolean): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/isSecondHand/")
      .bodyJson({ content: { productId: id, isSecondHand } })
      .sendJson();
  }
  static updatePrice(id: string, price: any): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/price/")
      .bodyJson({ content: { productId: id, price } })
      .sendJson();
  }
  static addBundle(id: string, bundle: any): Promise<any> {
    return Server.request()
      .POST()
      .path("productv2/bundle/")
      .bodyJson({ content: { productId: id, bundle } })
      .sendJson();
  }
  static removeBundle(id: string, bundle: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path("productv2/bundle/")
      .bodyJson({ content: { productId: id, bundle: bundle } })
      .sendJson();
  }
  static addGift(id: string, gift: any): Promise<any> {
    return Server.request()
      .POST()
      .path("productv2/gift/")
      .bodyJson({ content: { productId: id, gift } })
      .sendJson();
  }
  static removeGift(id: string, gift: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path("productv2/gift/")
      .bodyJson({ content: { productId: id, gift } })
      .sendJson();
  }

  static addSpecification(id: string, specification: any): Promise<any> {
    return Server.request()
      .POST()
      .path("productv2/specification/")
      .bodyJson({ content: { productId: id, specification } })
      .sendJson();
  }
  static removeSpecification(id: string, specification: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path("productv2/specification/")
      .bodyJson({ content: { productId: id, specification } })
      .sendJson();
  }
  static updateSpecifications(id: string, specifications: any[]): Promise<any> {
    return Server.request()
      .PUT()
      .path("productv2/specification/list")
      .bodyJson({ content: { productId: id, specifications } })
      .sendJson();
  }
  static addImage(id: string, imageForm: any): Promise<any> {
    return Server.request()
      .POST()
      .path(`productv2/id/${id}/image/`)
      .body(imageForm)
      .send();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`productv2/id/${id}/image/`)
      .bodyJson({ content: { image } })
      .sendJson();
  }
}
