"""
BariWiki Backend API Testing
Tests all API endpoints for the bariatric surgery encyclopedia
"""
import requests
import sys
from datetime import datetime

class BariWikiAPITester:
    def __init__(self, base_url="https://bari-wiki.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_term_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   {method} {endpoint}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {response_data}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"   ❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "/api/health",
            200
        )

    def test_stats(self):
        """Test stats endpoint"""
        return self.run_test(
            "Get Stats",
            "GET",
            "/api/stats",
            200
        )

    def test_admin_login(self, username="admin", password="BariWiki2024!"):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/api/admin/login",
            200,
            data={"username": username, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   🔑 Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        return self.run_test(
            "Admin Login (Invalid Credentials)",
            "POST",
            "/api/admin/login",
            401,
            data={"username": "wrong", "password": "wrong"}
        )

    def test_create_term(self):
        """Test creating a new term"""
        term_data = {
            "name": "Gastric Bypass",
            "description": "<p>A surgical procedure that creates a small pouch from the stomach and connects it directly to the small intestine.</p>",
            "short_description": "A weight loss surgery that reduces stomach size and reroutes digestion.",
            "category": "Procedures",
            "related_terms": ["Roux-en-Y", "Bariatric Surgery"],
            "authority_links": [
                {
                    "title": "Mayo Clinic - Gastric Bypass",
                    "url": "https://www.mayoclinic.org/tests-procedures/gastric-bypass-surgery/about/pac-20385189",
                    "source": "Mayo Clinic"
                }
            ],
            "status": "draft"
        }
        
        success, response = self.run_test(
            "Create Term",
            "POST",
            "/api/admin/terms",
            200,
            data=term_data
        )
        
        if success and '_id' in response:
            self.created_term_id = response['_id']
            print(f"   📝 Created term ID: {self.created_term_id}")
            return True, response
        return False, {}

    def test_list_admin_terms(self):
        """Test listing terms (admin endpoint)"""
        return self.run_test(
            "List Admin Terms",
            "GET",
            "/api/admin/terms?page=1&limit=10",
            200
        )

    def test_get_term_by_id(self):
        """Test getting a single term by ID"""
        if not self.created_term_id:
            print("   ⚠️  SKIPPED - No term ID available")
            return False, {}
        
        return self.run_test(
            "Get Term by ID",
            "GET",
            f"/api/admin/terms/{self.created_term_id}",
            200
        )

    def test_update_term(self):
        """Test updating a term"""
        if not self.created_term_id:
            print("   ⚠️  SKIPPED - No term ID available")
            return False, {}
        
        update_data = {
            "description": "<p>Updated description: A surgical procedure that creates a small pouch from the stomach and connects it directly to the small intestine, bypassing most of the stomach.</p>",
            "category": "Procedures"
        }
        
        return self.run_test(
            "Update Term",
            "PUT",
            f"/api/admin/terms/{self.created_term_id}",
            200,
            data=update_data
        )

    def test_publish_term(self):
        """Test publishing a term"""
        if not self.created_term_id:
            print("   ⚠️  SKIPPED - No term ID available")
            return False, {}
        
        return self.run_test(
            "Publish Term",
            "POST",
            f"/api/admin/terms/{self.created_term_id}/publish",
            200
        )

    def test_public_list_terms(self):
        """Test public terms listing"""
        return self.run_test(
            "Public List Terms",
            "GET",
            "/api/terms?page=1&limit=10&status=published",
            200
        )

    def test_get_letters(self):
        """Test getting letters with counts"""
        return self.run_test(
            "Get Letters with Counts",
            "GET",
            "/api/terms/letters",
            200
        )

    def test_get_categories(self):
        """Test getting categories"""
        return self.run_test(
            "Get Categories",
            "GET",
            "/api/terms/categories",
            200
        )

    def test_search_terms(self):
        """Test search functionality"""
        return self.run_test(
            "Search Terms",
            "GET",
            "/api/terms/search?q=gastric",
            200
        )

    def test_get_terms_by_letter(self):
        """Test getting terms by letter"""
        return self.run_test(
            "Get Terms by Letter (G)",
            "GET",
            "/api/terms/letter/G",
            200
        )

    def test_get_terms_by_category(self):
        """Test getting terms by category"""
        return self.run_test(
            "Get Terms by Category",
            "GET",
            "/api/terms/category/Procedures",
            200
        )

    def test_delete_term(self):
        """Test deleting a term"""
        if not self.created_term_id:
            print("   ⚠️  SKIPPED - No term ID available")
            return False, {}
        
        return self.run_test(
            "Delete Term",
            "DELETE",
            f"/api/admin/terms/{self.created_term_id}",
            200
        )


def main():
    print("=" * 70)
    print("BariWiki Backend API Testing")
    print("=" * 70)
    
    tester = BariWikiAPITester()
    
    # Public endpoints (no auth required)
    print("\n" + "=" * 70)
    print("PUBLIC ENDPOINTS")
    print("=" * 70)
    
    tester.test_health_check()
    tester.test_stats()
    
    # Admin authentication
    print("\n" + "=" * 70)
    print("ADMIN AUTHENTICATION")
    print("=" * 70)
    
    tester.test_admin_login_invalid()
    
    if not tester.test_admin_login():
        print("\n❌ Admin login failed. Cannot proceed with authenticated tests.")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1
    
    # Admin CRUD operations
    print("\n" + "=" * 70)
    print("ADMIN CRUD OPERATIONS")
    print("=" * 70)
    
    tester.test_create_term()
    tester.test_list_admin_terms()
    tester.test_get_term_by_id()
    tester.test_update_term()
    tester.test_publish_term()
    
    # Public data endpoints
    print("\n" + "=" * 70)
    print("PUBLIC DATA ENDPOINTS")
    print("=" * 70)
    
    tester.test_public_list_terms()
    tester.test_get_letters()
    tester.test_get_categories()
    tester.test_search_terms()
    tester.test_get_terms_by_letter()
    tester.test_get_terms_by_category()
    
    # Cleanup
    print("\n" + "=" * 70)
    print("CLEANUP")
    print("=" * 70)
    
    tester.test_delete_term()
    
    # Final results
    print("\n" + "=" * 70)
    print("FINAL RESULTS")
    print("=" * 70)
    print(f"✅ Tests Passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"❌ Tests Failed: {tester.tests_run - tester.tests_passed}/{tester.tests_run}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📊 Success Rate: {success_rate:.1f}%")
    print("=" * 70)
    
    return 0 if tester.tests_passed == tester.tests_run else 1


if __name__ == "__main__":
    sys.exit(main())
