import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { StudentResponse } from '../../core/models/StudentResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './student-list.component.html',
  standalone: true,
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  students: StudentResponse[] = [];
  loadError = false;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loadError = false;
    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => (this.students = students),
        error: () => (this.loadError = true)
      });
  }

  deleteStudent(student: StudentResponse): void {
    if (!confirm(`Supprimer ${student.firstName} ${student.lastName} ?`)) {
      return;
    }
    this.studentService.delete(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadStudents());
  }
}
