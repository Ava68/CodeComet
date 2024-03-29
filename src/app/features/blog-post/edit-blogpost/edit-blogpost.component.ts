import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css'],
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];
  isImageSelectorVisible: boolean = false;
  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  deleteBlogpostSubscription?: Subscription;
  imageSelectSubscription?: Subscription;
  imageUrl?: string;
  value: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        // Get BlogPost From API
        if (this.id) {
          this.getBlogPostSubscription = this.blogPostService
            .getBlogPostById(this.id)
            .subscribe({
              next: (response) => {
                this.model = response;
                this.imageUrl = this.model?.featuredImageUrl;
                this.selectedCategories = response.categories.map((x) => x.id);
                this.checkImageUrlValidity(this.imageUrl);
              },
            });
        }
        this.imageSelectSubscription = this.imageService
          .onSelectImage()
          .subscribe({
            next: (resp) => {
              if (this.model) {
                this.model.featuredImageUrl = resp.url;
                this.isImageSelectorVisible = false;
              }
            },
          });
      },
    });
  }
  checkImageUrlValidity(url: string): void {
    this.blogPostService.isValidImageUrl(url).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.value = true;
        } else {
          this.value = false;
        }
      },
      error: (err) => {
        console.error('Error checking image URL:', err);
      },
    });
  }

  onFormSubmit(): void {
    // convert model to request object
    if (this.model && this.id) {
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? [],
      };

      this.updateBlogPostSubscription = this.blogPostService
        .updateBlogPost(this.id, updateBlogPost)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          },
        });
    }
  }
  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }
  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }
  onDelete() {
    if (this.id) {
      // call service and delete blogpost
      this.deleteBlogpostSubscription = this.blogPostService
        .deleteBlogPost(this.id)
        .subscribe({
          next: (res) => {
            this.router.navigateByUrl('/admin/blogposts');
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.deleteBlogpostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
