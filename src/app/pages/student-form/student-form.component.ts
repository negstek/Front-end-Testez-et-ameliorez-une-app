import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { StudentRequest } from '../../core/models/StudentRequest';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './student-form.component.html',
  standalone: true,
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentForm: FormGroup = new FormGroup({});
  submitted = false;
  serverError = false;
  // null while creating; set once the existing student is fetched when editing
  studentId: number | null = null;

  get isEditMode(): boolean {
    return this.studentId !== null;
  }

  get form() {
    return this.studentForm.controls;
  }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.studentId = Number(idParam);
      this.studentService.getById(this.studentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((student) => {
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            birthDate: student.birthDate
          });
        });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError = false;
    if (this.studentForm.invalid) {
      return;
    }

    const student: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value,
      birthDate: this.studentForm.get('birthDate')?.value
    };

    const request$ = this.isEditMode
      ? this.studentService.update(this.studentId as number, student)
      : this.studentService.create(student);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/students']),
        error: () => (this.serverError = true)
      });
  }
}
