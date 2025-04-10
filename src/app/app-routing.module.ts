import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./core/pages/dashboard/dashboard.component";
import { ViewComponent } from "./core/pages/view/view.component";

const routes: Routes = [
    { path: "", redirectTo: "dashboard/:id", pathMatch: "full" },
    { path: "dashboard/:id", component: DashboardComponent },
    { path: "view/:image", component: ViewComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
