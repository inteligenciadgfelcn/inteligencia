using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.Web.Security;
using GMapGeocoder;
using Subgurim.Controles;
public partial class Forms_FRM_OP_ING : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    string pase = Servicio.Verificarusuario(HttpContext.Current.User.Identity.Name);
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Formularios.Verificar(usuariolog.Trim(), "FRM-OP-ING.aspx") == "SI")
            {
                muestraoperativos();
                muestranoaprob();
            }
            else
            {
                Response.Redirect("~/Forms/Default3.aspx");
            }
        }
    }

    protected void btnActualizar_Click(object sender, EventArgs e)
    {
        muestraoperativos();
        muestranoaprob();
    }
    protected void muestraoperativos()
    {
        GridView1.DataSource = null;
        GridView1.DataBind();
        string CadenaFinal;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        CadenaFinal = "SELECT ASIGNACION.Casos_Id AS P1, UNIDADES.Uni_Descripcion AS P2, DISTRITALES.Dis_Descripcion AS P3, GRUPOS.Descripcion AS P4, ASIGNACION.NroCaso AS P5, ASIGNACION.NroCasoPerDom AS P6, ASIGNACION.NroOperativo AS P7, ASIGNACION.NombreCaso AS P8, ASIGNACION.AsigCaso AS P9, ASIGNACION.FiscalAsigCaso AS P10, '' AS P11, \r\n                      '' AS P12 " +
                      "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN GRUPOS ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id " +
                      "WHERE (ASIGNACION.Usuario = N'" + pase.Trim() + "') ORDER BY P2, P3, P4";
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView1.DataSource = ds;
        GridView1.DataBind();
        con.Close();
    }
    protected void muestranoaprob()
    {
        GridView2.DataSource = null;
        GridView2.DataBind();
        string CadenaFinal;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        CadenaFinal = "SELECT ASIGNACION.Casos_Id AS P1, UNIDADES.Uni_Descripcion AS P2, DISTRITALES.Dis_Descripcion AS P3, GRUPOS.Descripcion AS P4, ASIGNACION.NroCaso AS P5, ASIGNACION.NroCasoPerDom AS P6, ASIGNACION.NroOperativo AS P7, ASIGNACION.NombreCaso AS P8, ASIGNACION.AsigCaso AS P9, ASIGNACION.FiscalAsigCaso AS P10, '' AS P11, \r\n                      '' AS P12 " +
                      "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN GRUPOS ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id " +
                      "WHERE (ASIGNACION.Usuario = N'" + pase.Trim() + "') AND (RTRIM(ASIGNACION.NroCaso) = '') ORDER BY P2, P3, P4";
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaFinal, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView2.DataSource = ds;
        GridView2.DataBind();
        con.Close();
    }
    protected void GridView2_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridView2.SelectedRow;
        Response.Redirect("FRM-OP?id=" + row.Cells[0].Text.Trim());
    }   
}