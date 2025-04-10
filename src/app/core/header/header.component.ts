import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "header",
    templateUrl: "./header.component.html",
    standalone: true,
    styleUrl: "./header.component.scss",
})
export class HeaderComponent {
    constructor(private router: Router) {}
    public goToDashboard() {
        this.router.navigate([`/dashboard/1`]);
    }
}
