from django.shortcuts import render

# Create your views here.


def top(request):
    return render(request, 'baito/top.html')


def sift(request):
    return render(request, 'baito/sift.html')


def login_view(request):
    return render(request, 'baito/login.html')


def signup(request):
    return render(request, 'baito/signup.html')


def setting(request):
    return render(request, 'baito/setting.html')
