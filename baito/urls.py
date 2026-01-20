from django.urls import path
from . import views

app_name = 'baito'

urlpatterns = [
    path('', views.top, name='top'),
    path('sift/', views.sift, name='sift'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    path('setting/', views.setting, name='setting'),
    path("delete/<int:shift_id>/", views.delete_shift, name="delete_shift"),
    path("api/shifts/", views.shift_month_api, name="shift_month_api"),
]
