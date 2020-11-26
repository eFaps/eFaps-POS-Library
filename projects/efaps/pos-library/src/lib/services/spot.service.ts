import { Injectable } from "@angular/core";
import { Observable, forkJoin } from "rxjs";

import { Position, Spot, SpotsLayout, Workspace } from "../model";
import { ConfigService } from "./config.service";
import { DocumentService } from "./document.service";
import { WorkspaceService } from "./workspace.service";

@Injectable({
  providedIn: "root",
  deps: [DocumentService, WorkspaceService],
})
export class SpotService {
  public positions: any = {};
  private workspace: Workspace;

  constructor(
    private documentService: DocumentService,
    private workspaceService: WorkspaceService,
    config: ConfigService,
  ) {
    if (config.persistence) {
      this.positions = config.persistence.spotPositions();
    }
    workspaceService.currentWorkspace.subscribe({
      next: (workspace) => (this.workspace = workspace),
    });
  }

  public getSpots(): Observable<Spot[]> {
    return new Observable((observer) => {
      this.documentService.getOrders4Spots().subscribe((_orders) => {
        const spots: Spot[] = [];
        for (let i = 0; i < this.workspaceService.getSpotSize(); i++) {
          const orders = _orders.filter((o) => o.spot && o.spot.id === "" + i);
          spots.push({ id: "" + i, label: "M " + (i + 1), orders: orders });
        }
        observer.next(spots);
        observer.complete();
      });
    });
  }

  public getLayout(): Observable<SpotsLayout> {
    let layout: SpotsLayout = {
      floors: this.workspace.floors,
    };
    return new Observable((observer) => {
      this.documentService.getOrders4Spots().subscribe((_orders) => {
        layout.floors.forEach((floor) => {
          floor.spots
            .sort((s1, s2) => {
              return s1.label.localeCompare(s2.label);
            })
            .forEach((spot) => {
              if (spot.oid) {
                spot.id = spot.oid;
              }
              const orders = _orders.filter(
                (o) => o.spot && o.spot.id === spot.id
              );
              spot.orders = orders;
              spot.position = this.positions[spot.id];
            });
        });
        observer.next(layout);
        observer.complete();
      });
    });
  }

  setPosition(spot: Spot, position: Position): void {
    this.positions[spot.id] = position;
    this.positions.save();
  }

  public swap(origin: Spot, target: Spot) {
    const orders = origin.orders;
    const obsv = [];
    orders.forEach((order) => {
      order.spot = { id: target.id, label: target.label };
      obsv.push(this.documentService.updateOrder(order));
    });
    return forkJoin(obsv);
  }
}
