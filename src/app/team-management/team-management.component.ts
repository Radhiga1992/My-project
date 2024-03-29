import { Component,OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { TeamManagementService } from '../team-management.service';
import { Team } from '../team';
import { Employee } from '../employee';
@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css']
})
export class TeamManagementComponent implements OnInit {
  teamForm = {} as FormGroup;
	isValidFormSubmitted: boolean | null = null;
	allSkills: Observable<any[]>;
	constructor(
		private formBuilder: FormBuilder,
		private teamMngService: TeamManagementService) {
		this.allSkills = this.teamMngService.getSkills();
	}
	ngOnInit() {
		this.teamForm = this.formBuilder.group({
			teamName: ['', Validators.required],
			employees: this.formBuilder.array(
				[this.createEmpFormGroup()],
				[Validators.required, Validators.maxLength(5)])
		});
	}
	createEmpFormGroup() {
		return this.formBuilder.group({
			empName: ['', [Validators.required]],
			age: ['', [Validators.required, Validators.min(21)]],
			skill: ['', [Validators.required]],
		})
	}
	get teamName() {
		return this.teamForm.get('teamName');
	}
	get employees(): FormArray {
		return this.teamForm.get('employees') as FormArray;
	}
	addEmployee() {
		let fg = this.createEmpFormGroup();
		this.employees.push(fg);
	}
	deleteEmployee(idx: number) {
		this.employees.removeAt(idx);
	}
	onFormSubmit() {
		this.isValidFormSubmitted = false;
		if (this.teamForm.invalid) {
			return;
		}
		this.isValidFormSubmitted = true;
		let team: Team = this.teamForm.value;
		this.teamMngService.saveTeam(team);
		this.teamForm.reset();
	}
	resetTeamForm() {
		this.teamForm.reset();
	}
} 

