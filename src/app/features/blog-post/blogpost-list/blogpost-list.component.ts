import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css'],
})
export class BlogpostListComponent implements OnInit {
  blogPosts$?: Observable<BlogPost[]>;
  blogpost: any;

  constructor(private blogPostService: BlogPostService) {}

  // use async pipe to handle subscription and unsubscription
  ngOnInit(): void {
    // get all blogposts from API
    this.blogPosts$ = this.blogPostService.getAllBlogPosts();
  }
}
