/**
 * Title: service.interface.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: service interface for the bcrs project
 */

//service interface
export interface Service {
  _id?: string;
  serviceName: string;
  price: number;
}
